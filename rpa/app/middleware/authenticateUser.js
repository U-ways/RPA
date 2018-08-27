/* Authenticate user middleware
============================================================================= */

import { email     } from '../services/email/index.js';
import { UserModel } from '../mvc/models/User.js';

const env = process.env;

/**
 * Send an email to allow user to password reset or terminate locked session.
 * The email contains a token to prove account ownership on request.
 *
 * @param  {Object} user  the user to receive the email
 */
async function sendLockOutEmail (user) {
  let token = await user.generateToken();
  const data = {
    to:   { name: user.username, email: user.email,       },
    from: { name: env.BOT_USERNAME, email: env.BOT_EMAIL, },
    subject: 'RPA - account locked',
    text: 'locked.txt',
    html: 'locked.mst',
    unlockURL: 'http://www.' + `${env.HOST}:${env.HTTP_PORT}`
      + `/unlock/${user.id}/${token}`,
    resetURL:  'http://www.' + `${env.HOST}:${env.HTTP_PORT}`
      + `/reset/${user.id}/${token}`,
  };
  email.send(data)
    .catch( err => {
      let error = new Error(`failed to send lockout email`);
      if (env.NODE_ENV === 'development') error.dev = err;
      throw error;
    });
}

/**
 * Authenticate a client based on username (or email) and password input.
 * The function will lookup for the user requested and will test the supplemented
 * password against the user's hashed password. It will pass the control to the
 * next middleware if successful, otherwise the control is passed to an error
 * handler middleware.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next}            pass the request to the next middleware on success.
 *                           pass to error middleware on failure otherwise.
 */
export function authenticateUser (req, res, next) {
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  /** search conditions can be username or email based on client request */
  let conditions = !!username ? {username: username} : {email: email};

  /** find user based on query conditions */
  UserModel.findOne(conditions, (err, user) => {
    if (err) {
      let error = new Error(
        'Internal error - unable to query database, contact administrator.');
      if (env.NODE_ENV === 'development') error.dev = err;
      return next(error);
    }

    /** check if user exists */
    if (!user) {
      let input = Object.keys(conditions);
      let error = new Error(
        `${input} ${conditions[input]} isn't registered with any account. `
        + `Please try again or register ${conditions[input]} with a new account.`);
      error.status = 401;
      return next(error);
    };

    /** check if account is locked */
    if (user.security.lockedUntil > Date.now()) {
      let error = new Error(
        `Your account is locked until ${user.security.lockedUntil} `
        + `An email has been sent to password reset your account or terminate your locked session.`);
      error.status = 403;
      return next(error);
    }

    /** else attempt to authenticate with the requested password */
    return user.validatePassword(password, user.security.password)
    .then(match => {
      if (match) {
        res.locals = { user: user };
        return next();
      }
      /** incorrect password, increase login attempts */
      else {
        user.incLoginAttempts()
        .then(user => {
          /** check if account ran out of login attempts (got locked) */
          if (user.security.lockedUntil > Date.now()) {
            /** send an email for a password reset or lockout termination */
            sendLockOutEmail(user);
            let error = new Error(
              `Exceeded maximum login attempts, your account is locked until ${user.security.lockedUntil}. `
              + `An email has been sent to password reset your account or terminate your locked session.`);
            error.status = 403;
            return next(error);
          }

          /** else warn user about incorrect password */
          let loginAttemptsLeft = UserModel.MAX_LOGIN_ATTEMPTS - user.security.loginAttempts;
          let error = new Error(
            'Incorrect password, please try again. '
            + `(You have ${loginAttemptsLeft} login attempts left)`);
          error.status = 401;
          return next(error);
        });
      };
    })
    .catch(err => {
      let error = new Error(
        'Internal error - unable to validated password, contact administrator.');
      if (env.NODE_ENV === 'development') error.dev = err;
      return next(error);
    });

  });
}
