/* login controller
============================================================================= */

import path from 'path';
import { Router } from 'express';
import { UserModel } from '../models/User.js';

import { blockAuthUsers }   from '../../middleware/blockAuthUsers.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { preventSessionDuplication } from '../../middleware/preventSessionDuplication.js';

const router = Router();
const ENV    = process.env;

/** get current file name and remove extension */
const FILE_NAME = path.basename(__filename).slice(0, -3);

router.get('/',
  blockAuthUsers,
  getLogic,
);

router.post('/',
  blockAuthUsers,
  authenticateUser,
  preventSessionDuplication,
  postLogic,
);

/* logic
============================================================================= */

/**
 * Display a login page that can redirect on login success using the
 * `res.locals.flash.redirect` property if available.
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
    captcha: res.recaptcha,
    session: req.session,
  };
  return res.render(FILE_NAME, view);
}

/**
 * Creates a new session, set the user session to authenticated,
 * log user activity, and redirect to the dashboard.
 *
 * For security reasons, If the session is unable to regenerate,
 * the user won't be authenticated and server will abort with an error response.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        redirect on success, error resposne otherwise.
 */
function postLogic (req, res, next) {
  /** current logged-in user */
  let user = res.locals.user;

  /** get a defined redirect before destroying the non-auth session */
  let redirect = req.session.redirect;

  /** create new session for authenticated user */
  req.session.regenerate(err => {
    if (err) {
      let error = new Error(
        'unable to create a new session for authenticated user.');
      if (ENV.NODE_ENV === 'development') error.dev = err;
      return next(error);
    }

    /** set auth to true so user can access protected pages */
    req.session.auth = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    }
    /** increase session timeout to 30 minutes for authenticated users */
    req.session.cookie.maxAge = 30 * 60 * 1000;

    /** update user meta data */
    user.sessionID = req.session.id;
    user.loginAttempts = 0;
    user.createLog('LOGIN');
    user.save();

    req.session.flash = {
      message: `Welcome back ${user.username}, `
      + `You last logged-in on: ${user.getLastLoginDate().toUTCString()}.`
    };
    return res.redirect(redirect ? redirect : '/dashboard');
  });
}

export default router;
