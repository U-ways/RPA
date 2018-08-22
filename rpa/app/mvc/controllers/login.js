/* login controller
============================================================================= */

import { Router } from 'express';
import { UserModel } from '../models/User.js';

import { blockAuthUsers }   from '../../middleware/blockAuthUsers.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';
import { preventSessionDuplication } from '../../middleware/preventSessionDuplication.js';

const ENV    = process.env;
const router = Router();

router.post('/',
  blockAuthUsers,
  authenticateUser,
  preventSessionDuplication,
  postLogic);

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
  let user = res.locals.user;

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
      + `You last logged-in on: ${user.getLastLoginDate().toUTCString()}.`};
    return res.redirect('/dashboard');
  });
}

export default router;
