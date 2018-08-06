/* login controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';

const router = express.Router();

router.get('/', (req, res) => {
  let view = {
    title: 'Login',
    message: res.locals.message
  };

  res.status(res.locals.status || 200);
  res.render('login', view);
});

router.post('/', authenticateUser, login);

/* logic
============================================================================= */

/**
 * Creates a new session and set the session as authenticated.
 *
 * NOTE: For security reasons, If the session is unable to regenerate,
 * the user won't be authenticated and receive an error response.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        pass the request to the next middleware on success.
 *                           pass to error middleware on failure otherwise.
 */
function login (req, res, next) {
  let user = req.locals.user;

  /** create new session for authenticated user */
  req.session.regenerate(err => {
    if (err) {
      return res.status(500)
        .json({ error: 'Unable to create a new session for authenticated user.' });
    }

    req.session.auth = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    }
    /** increase session age to 30 minutes for authenticated users */
    req.session.cookie.maxAge = 30 * 60 * 1000;

    /** log user activity and then redirect to dashboard */
    user.logs.push({activity: 0});
    user.save().then(user => {
      req.session.feedback = {
        message: `welcome back ${user.username}, last login: [find last login using API].`
      };
      return res.redirect('/dashboard');
    });
  });
}

export default router;
