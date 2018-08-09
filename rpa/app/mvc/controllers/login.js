/* login controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';

import { authenticateUser } from '../../middleware/authenticateUser.js';
import { checkSession }     from '../../middleware/checkSession.js';

const ENV    = process.env;
const router = express.Router();

router.post('/', checkSession, authenticateUser, postLogic);

/* logic
============================================================================= */

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
  let user = req.locals.user;

  /** check if user already logged-in */
  if (user.loggedIn) {
    let error = new Error(
      'user already logged-in. '
      + 'Please request a password reset if this is not you.');
    error.status = 401;
    return next(error);
  }

  /** create new session for authenticated user */
  req.session.regenerate(err => {
    if (err) {
      let error = new Error(
        'unable to create a new session for authenticated user.');
      if (ENV.NODE_ENV === '1') error.dev = err;
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
    user.logs.push({activity: 0});
    user.loggedIn = true;
    user.loginAttempts = 0;

    /** log user activity and then redirect to dashboard */
    return user.save().then(user => {
      /** sort user log based on login activity and time */
      user.logs.sort((a,b) => {
        return (a.activity === 0 && a.date > b.date) ? -1 : 1;
      });
      /** User's last login session date */
      let lastLogin = new Date(user.logs[1].date);

      req.session.temp = {
        message: `Welcome back ${user.username}, `
               + `You last logged-in on: ${lastLogin.toUTCString()}.`
      };
      return res.redirect('/dashboard');
    });
  });
}

export default router;
