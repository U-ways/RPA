/* Authenticate user middleware
============================================================================= */

import { Email     } from '../services/email/index.js';
import { UserModel } from '../mvc/models/User.js';

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
  let { username, email, password } = req.body;

  /** search conditions can be username or email based on client request */
  let conditions = !!username ? {username: username} : {email: email};

  /** find user based on query conditions */
  UserModel.findOne(conditions, (err, user) => {
    if (err) {
      let error = new Error(
        'Internal error - unable to query database, contact administrator.');
      if (process.env.NODE_ENV === 'development') error.dev = err;
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
            Email.send.transactional.lockoutUser(user);
            /** respond with an error as the account got locked */
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
      if (process.env.NODE_ENV === 'development') error.dev = err;
      return next(error);
    });

  });
}
