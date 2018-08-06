/* login controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';

const router = express.Router();

router.get('/',  getLogic);
router.post('/', authenticateUser, postLogic);

/* logic
============================================================================= */

/**
 * Respond with an error if user already logged in,.
 * Render the login page otherwise.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render login page on success, error resposne otherwise.
 */
function getLogic (req, res, next) {
  /** check if user already logged in */
  if (req.session.auth) {
    return res.status(400)
      .json({ error: `Already logged in as ${req.session.user.username}, `
                     + 'please sign out first to log in as another user.' });
  }

  let view = {
    title: 'Login',
    message: res.locals.message
  };

  res.status(res.locals.status || 200);
  return res.render('login', view);
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
  let user = req.locals.user;

  /** create new session for authenticated user */
  req.session.regenerate(err => {
    if (err) {
      return res.status(500)
        .json({ error: 'Unable to create a new session for authenticated user.' });
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

    /** log user activity and then redirect to dashboard */
    user.logs.push({activity: 0});
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
