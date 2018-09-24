/* reset controller
============================================================================= */

import path from 'path';

import { Router    } from 'express';
import { UserModel } from '../../../models/User.js';
import { emailService      } from '../../../../services/email/index.js';
import { blockAuthUsers    } from '../../../../middleware/blockAuthUsers.js';
import { blockNonAuthUsers } from '../../../../middleware/blockNonAuthUsers.js';

const router = Router();

/** get current file name and remove extension */
const fileName = path.basename(__filename).slice(0, -3);

router.get('/',
  blockNonAuthUsers,
  getLogic,
);

router.get('/request',
  blockAuthUsers,
  requestPasswordReset,
);

router.get('/:id/:token',
  blockAuthUsers,
  verifyPasswordReset,
  getLogic,
);

router.post('/',
  blockNonAuthUsers,
  passwordReset,
);

/**
 * Send a transactional email with a password reset token on valid user request
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        email on success, error resposne otherwise.
 */
function requestPasswordReset (req, res, next) {
  let { username, email } = req.query;

  /** search conditions can be username or email based on client request */
  let conditions = !!username ? {username: username} : {email: email};

  /** find user based on query conditions */
  UserModel.findOne(conditions, (err, user) => {
    if (err) {
      let error = new Error(
        'Internal error - unable to query database, contact administrator.');
      error.dev = err;
      return next(error);
    };

    /** check if user exists */
    if (!user) {
      let input = Object.keys(conditions);
      let error = new Error(
        `${input} ${conditions[input]} isn't registered with any account. `
        + `Please double check your input or register ${conditions[input]} with a new account.`);
      error.status = 400;
      return next(error);
    }
    else {
      /** send an email for a password reset or lockout termination */
      emailService.send.transactional.passwordReset(user);
      return res.json({ message: 'password request email sent, please check your email. ' });
    }
  });
}

/**
 * Display password-reset page.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render on success, error resposne otherwise.
 */
 function getLogic (req, res, next) {
   let view = {
     title:   fileName,
     flash:   res.locals.flash,
     session: req.session,
   };

   return res.render(fileName, view);
 }

/**
 * Verify id and hash requested and then allow to password-reset user account
 * by logging user in and rendering password-reset page.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render on success, error resposne otherwise.
 */
async function verifyPasswordReset (req, res, next) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (!user) throw new Error('User id doesn\'t exist');

    let validate = await user.validateToken(req.params.token);
    if (!validate) throw new Error('Invalid token value');

    /** terminate locked session */
    user.security.lockedUntil = null;
    /** remove security token */
    user.security.token = null;

    /** create new session for authenticated user */
    return req.session.regenerate(err => {
      if (err) {
        let error = new Error(
          'Unable to create a new session for authenticated user.');
        error.dev = err;
        return next(error);
      }

      /** set auth to true so user can access protected pages */
      req.session.auth = true;
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
      };
      /** increase session timeout to 30 minutes for authenticated users */
      req.session.cookie.maxAge = 30 * 60 * 1000;

      /** update user meta data */
      user.security.sessionID = req.session.id;
      user.createLog('LOGIN', 'Login through password reset ');
      user.save();

      res.locals.message = 'Please input your new password.';
      return next();
    });
  }
  catch (err) {
    let error = new Error('Password reset request failed.');
    error.dev = err;
    error.status = 400;
    return next(error);
  }
}

/**
 * Password reset user account and redirect to dashboard on success.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        redirect on success, error resposne otherwise.
 */
async function passwordReset (req, res, next) {
  try {
    let user = await UserModel.findById(req.session.user.id).exec();

    /** reset user password with the one requested */
    user.security.password = req.body.password;
    user.createLog('UPDATE', 'Password reset account');
    user.save();

    req.session.flash = {
      message: 'You\'ve successfully password reset your account\'s password.'
    };
    return res.redirect('/app');
  }
  catch (err) {
    let error = new Error('Failed to password reset account.');
    error.dev = err;
    error.status = 400;
    return next(error);
  }
}

export default router;
