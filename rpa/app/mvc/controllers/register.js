/* registration controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';

import { reCaptcha }    from '../../middleware/reCaptcha.js';
import { checkSession } from '../../middleware/checkSession.js';

const router = express.Router();

router.post('/',
  checkSession,
  reCaptcha.middleware.verify,
  registerUser,
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
  /** newly registered user */
  let user = req.locals.user;

  /** create new session for newly registered user */
  req.session.regenerate(err => {
    if (err) {
      return res.status(500)
        .json({ error: 'Unable to create a new session for authenticated user.' });
    }

    /** set auth to true so new user can access protected pages */
    req.session.auth = true;
    /** new user flag */
    req.session.new  = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    /** increase session timeout to 30 minutes for authenticated users */
    req.session.cookie.maxAge = 30 * 60 * 1000;

    /** log user activity and then redirect to dashboard */
    user.logs.push({
      activity: 0,
      description: 'user registered'
    });
    user.save().then(user => {
      res.redirect('/dashboard');
    });
  });
}

/**
 * TODO:
 *   Finish me off, create a better recaptcha handler.
 *   infact, create a middleware for it?
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        pass the request to the next middleware on success.
 *                           pass an error resposne otherwise.
 */
function registerUser (req, res, next) {
  if (req.recaptcha.error) {
    return res.status(401)
      .json({ error: `Failed recaptcha - ${req.recaptcha.error}` });
  }

  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  UserModel.find({ $or: [{username: username}, {email: email}] })
  .then(docs => {
    if (docs.length > 1) {
      return res.status(409)
        .json({ error: 'Username and email already exists.' });
    }
    else if (docs.length === 1) {
      let duplicate = (docs[0].username === username) ? 'Username' : 'Email';
      return res.status(409)
        .json({ error: `${duplicate} already exists.` });
    }
    else {
      let createUser   = UserModel.create({
        username: username,
        password: password,
        email:    email
      });
      let hashPassword = createUser.then(user => {
        let hash = user.hashPassword(password);
        return hash.then(
          hashedPassword => {
            user.password = hashedPassword;
            return user.save();
          });
        }
      );
      hashPassword.then(user => {
        req.locals = { user: user };
        return next();
      });
    }
  })
  .catch(err => {
    return res.status(500)
      .json({ error: 'Unable to verify if username and email already taken.' });
  });
}

export default router;
