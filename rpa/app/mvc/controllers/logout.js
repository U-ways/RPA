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
  if (!req.session.user) {
    req.session.error = {
      status: 400,
      message: 'user already logged out: no active session found to destroy.'
    };
    return res.redirect('/');
  }

  let id = req.session.user.id;
  req.session.regenerate(() => {
    /** find the user with the active session */
    UserModel.findById(id).then(
      user => {
        /** log user activity and then redirect to dashboard */
        user.logs.push({ activity: 1 });
        user.save().then(user => {
          req.session.feedback = {
            status: 200,
            message:'success: you\'ve securely logged out.'
          }
          return res.redirect('/');
        });
      }
    );
  });
}

export default router;
