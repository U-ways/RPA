/* registration controller
============================================================================= */

import { Router } from 'express';
import { UserModel } from '../models/User.js';

import { blockAuthUsers } from '../../middleware/blockAuthUsers.js';
import { reCaptcha } from '../../middleware/reCaptcha.js';

const ENV    = process.env;
const router = Router();

router.post('/',
  blockAuthUsers,
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
 * @return {next|response}   pass to the next middleware on success.
 *                           return an error resposne otherwise.
 */
function registerUser (req, res, next) {
  /** check if user failed reCaptcha */
  if (req.recaptcha.error) {
    let error = new Error(
      'Failed to verify user through reCaptcha, please try again.');
    if (ENV.NODE_ENV === 'development') error.dev = req.recaptcha.error;
    error.status = 401;
    return next(error);
  }

  /** get user registration input */
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  /** check if username or email are a duplicate entry */
  UserModel.find({ $or: [{username: username}, {email: email}] })
  .then(docs => {
    if (docs.length > 1) {
      let error = new Error('Username and email already exists.');
      error.status = 409;
      return next(error);
    }
    else if (docs.length === 1) {
      let duplicate = (docs[0].username === username) ? 'Username' : 'Email';
      let error = new Error(`${duplicate} already exists.`);
      error.status = 409;
      return next(error);
    }
    /** create new user otherwise */
    else {
      let createUser = UserModel.create({
        username: username,
        password: password,
        email:    email
      });
      createUser.then(user => {
        res.locals = { user: user };
        return next();
      });
    }
  })
  .catch(err => {
    let error = new Error(
      'Unable to verify if username and email already taken.');
    if (ENV.NODE_ENV === 'development') error.dev = err;
    return next(error);
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
  let user = res.locals.user;

  /** create new session for newly registered user */
  req.session.regenerate(err => {
    /** check if session regeneration failed */
    if (err) {
      let error = new Error(
        'Unable to create a new session for authenticated user.');
      if (ENV.NODE_ENV === 'development') error.dev = err;
      return next(error);
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
    user.createLog('CREATE', 'register user account');
    user.save();

    res.redirect('/dashboard');
  });
}

export default router;
