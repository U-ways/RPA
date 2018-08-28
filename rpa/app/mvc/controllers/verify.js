/* verify controller
============================================================================= */

import { Router    } from 'express';
import { UserModel } from '../models/User.js';
import { Email     } from '../../services/email/index.js';
import { blockNonAuthUsers } from '../../middleware/blockNonAuthUsers.js';

const router = Router();

router.get('/',
  blockNonAuthUsers,
  blockVerifiedUsers,
  limitVerificationAttempts,
  sendVerificationEmail,
);

router.get('/:id/:token',
  blockNonAuthUsers,
  blockVerifiedUsers,
  verifyEmailAddress,
);

/* logic
============================================================================= */

/**
 * Reject users who already verified their email address.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   pass request to the next middleware on success.
 *                           responsed with an error on failure.
 */
async function blockVerifiedUsers (req, res, next) {
  let user = await UserModel.findById(req.session.user.id).exec();
  if (user.security.verified) {
    let error = new Error(`You've already verified your email address`);
    error.status = 400;
    return next(error);
  }
  return next();
}

/**
 * Allow 1 verification request per 5 minutes by using a `verReqTimestamp` to
 * check if enough time has passed since last request.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   pass request to the next middleware on success.
 *                           responsed with an error on failure.
 */
async function limitVerificationAttempts (req, res, next) {
  let user = req.session.user;
  if (!user.verReqTimestamp) return next();
  else {
    const FIVE_MINUTES = 300000; // ~5 minutes time in UNIX timestamp.
    const currentTimestamp = new Date().getTime();

    /** check if five minutes has passed since last verification request */
    if ((user.verReqTimestamp + FIVE_MINUTES) < currentTimestamp) return next();
    else {
      let error = new Error('Too many requests: '
        + 'Please wait 5 minutes before sending another verification request');
      error.status = 429;
      return next(error);
    }
  }
}

/**
 * Send a verification email to verify user's email.
 * The email contains a token to prove email ownership on request.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        respond with a message on success
 */
async function sendVerificationEmail (req, res, next) {
  try {
    let user  = await UserModel.findById(req.session.user.id).exec();
    /** send an email with a verification token */
    Email.send.transactional.verifyEmail(user);
    /** Add a timestamp to limit the number of emails sent */
    req.session.user.verReqTimestamp = new Date().getTime();
    return res.json(`message: Email verification request sent to ${user.email}. `
      + 'Please check your inbox...');
  }
  catch (err) {
    let error = new Error('Failed to send email verification request');
    if (process.env.NODE_ENV === 'development') error.dev = err;
    return next(error);
  }
}

/**
 * Verify email address by validating the token requested with the user's
 * stored security token.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   redirect to landing page on success.
 *                           responsed with an error on failure.
 */
async function verifyEmailAddress (req, res, next) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (!user) throw new Error('User id doesn\'t exist');

    let validate = await user.validateToken(req.params.token);
    if (!validate) throw new Error('Invalid token value');

    /** verify user email address */
    user.security.verified = true;
    /** remove security token */
    user.security.token = null;

    /** log user activity and then redirect to landing page */
    user.createLog('UPDATE', 'Verified email address');
    user.save();

    /** delete the verReqTimestamp to clear some space */
    delete req.session.user.verReqTimestamp;

    req.session.flash = { message: 'You\'ve successfully verified your email address.' }
    res.redirect('/');
  }
  catch (err) {
    let error = new Error('Failed to verify email address, '
      + 'Please request a new verification token.');
    if (process.env.NODE_ENV === 'development') error.dev = err;
    return next(error);
  }
}

export default router;
