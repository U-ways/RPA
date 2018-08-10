/* logout controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

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
 * @return {Function}        pass the request to the next middleware on success.
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

  /** get user ID before destroying session for logging activity */
  let id = req.session.user.id;

  /** destroy user session and create a new anonymous session */
  req.session.regenerate(() => {
    /** find the user with the active session */
    UserModel.findById(id).then(user => {
      /** update user meta data */
      user.loggedIn = false;
      /** createLog will save above meta data as a side effect */
      user.createLog('LOGOUT');

      /** redirect to dashboard */
      req.session.temp = { message:'success: you\'ve securely logged out.' }
      return res.redirect('/');
    });
  });
}

export default router;
