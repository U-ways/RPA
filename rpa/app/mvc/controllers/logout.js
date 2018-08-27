/* logout controller
============================================================================= */

import { Router    } from 'express';
import { UserModel } from '../models/User.js';

const router = Router();

router.get('/', destorySession);

/* logic
============================================================================= */

/**
 * Destroys the session and will unset the `req.session property`.
 * This middleware should be called whenever the user wants to log out.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next}            pass the request to the next middleware on success.
 *                           pass to error middleware on failure otherwise.
 */
function destorySession (req, res, next) {
  /** check if a user doesn't session exists */
  if (!req.session.user) {
    let error = new Error(
      'user already logged out: no active session found to destroy.');
    error.status = 400;
    return next(error);
  }

  /** get user ID before destroying session to log the activity */
  let id = req.session.user.id;

  /** destroy user session and create a new anonymous session */
  req.session.regenerate(() => {
    /** find the user with the active session */
    UserModel.findById(id).then(user => {
      /** update user meta data */
      delete user.security.sessionID;
      user.createLog('LOGOUT');
      user.save();

      /** redirect to dashboard */
      req.session.flash = { message:'success: you\'ve securely logged out.' }
      return res.redirect('/');
    });
  });
}

export default router;
