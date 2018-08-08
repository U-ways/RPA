/* registration controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';

import { reCaptcha }    from '../../middleware/reCaptcha.js';
import { checkSession } from '../../middleware/checkSession.js';

const ENV    = process.env;
const router = express.Router();

router.post('/',
  checkSession,
  reCaptcha.middleware.verify,
  registerUser,
  postLogic);

/* logic
============================================================================= */

/**
 * Collects user registration input, checks if username and/or email are of
 * duplicate entry, respond with an error if duplicate entry found,
 * create a new user and pass to the next middleware otherwise.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function | response} pass to the next middleware on success.
 *                               return an error resposne otherwise.
 */
function registerUser (req, res, next) {
  /** check if user failed reCaptcha */
  if (req.recaptcha.error) {
    let error = {
      error: 'Failed to verify user through reCaptcha, please try again.',
    };
    if (ENV.NODE_ENV === '1') error.dev = req.recaptcha.error;
    return res.status(401).json(error);
  }

  /** get user registration input */
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  /** check if username or email are a duplicate entry */
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
    /** create new user otherwise */
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
    let error = {
      error: 'Unable to verify if username and email already taken.',
    };
    if (ENV.NODE_ENV === '1') error.dev = err;
    return res.status(500).json(error);
  });
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
  /** newly registered user */
  let user = req.locals.user;

  /** create new session for newly registered user */
  req.session.regenerate(err => {
    /** check if session regeneration failed */
    if (err) {
      let error = {
        error: 'Unable to create a new session for authenticated user.',
      };
      if (ENV.NODE_ENV === '1') error.dev = err;
      return res.status(500).json(error);
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

export default router;
