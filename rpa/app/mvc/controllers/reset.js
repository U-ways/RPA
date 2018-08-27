/* reset controller
============================================================================= */

import path from 'path';

import { Router    } from 'express';
import { UserModel } from '../models/User.js';
import { blockAuthUsers    } from '../../middleware/blockAuthUsers.js';
import { blockNonAuthUsers } from './../../middleware/blockNonAuthUsers.js';

const router = Router();
const env    = process.env;

/** get current file name and remove extension */
const FILE_NAME = path.basename(__filename).slice(0, -3);

router.get('/',
  blockNonAuthUsers,
  getLogic,
);

router.get('/:id/:token',
  blockAuthUsers,
  allowPasswordReset,
  getLogic,
);

router.post('/',
  blockNonAuthUsers,
  passwordReset,
);

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
    title: FILE_NAME,
    stylesheets: [
      'iconfont/material-icons.css',
      'stylesheets/core.css',
      `stylesheets/${FILE_NAME}.css`
    ],
    scripts: [
      'scripts/core.js',
      `scripts/${FILE_NAME}.js`
    ],
    flash: res.locals.flash,
    message: res.locals.message,
    session: req.session,
  };
  return res.render(FILE_NAME, view);
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
async function allowPasswordReset (req, res, next) {
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
        if (env.NODE_ENV === 'development') error.dev = err;
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
    if (env.NODE_ENV === 'development') error.dev = err;
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
    return res.redirect('/dashboard');
  }
  catch (err) {
    let error = new Error('Failed to password reset account.');
    if (env.NODE_ENV === 'development') error.dev = err;
    error.status = 400;
    return next(error);
  }
}

export default router;
