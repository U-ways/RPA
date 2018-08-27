/* verify controller
============================================================================= */

import { Router    } from 'express';
import { UserModel } from '../models/User.js';
import { email     } from '../../services/email/index.js';
import { blockNonAuthUsers } from '../../middleware/blockNonAuthUsers.js';

const router = Router();
const env    = process.env;

router.get('/',
  blockNonAuthUsers,
  blockVerifiedUsers,
  limitVerificationAttempts,
  generateVerificationToken,
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
 * Allow 1 verification request per 5 minutes.
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
 * Generate email verification Hash by using the user's password hash
 * to be sent as a verification token.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   pass request to the next middleware on success.
 *                           responsed with an error on failure.
 */
async function generateVerificationToken (req, res, next) {
  try {
    let user         = await UserModel.findById(req.session.user.id).exec();
    res.locals.token = await user.createLockedSessionToken();
    return next();
  }
  catch (err) {
    let error = new Error('Failed to generate token for email verification');
    if (env.NODE_ENV === 'development') error.dev = err;
    return next(error);
  }
}

/**
 * Send a verification email to verify user's email.
 * The email contains a token to prove email ownership on request.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}  responsed with a message on success.
 *                     responsed with an error on failure.
 */
function sendVerificationEmail (req, res, next) {
  const user = req.session.user;
  const data = {
    to:   { name: user.username, email: user.email,       },
    from: { name: env.BOT_USERNAME, email: env.BOT_EMAIL, },
    subject: 'RPA - Verify Email',
    text: 'verify.txt',
    html: 'verify.mst',
    verifyURL: 'http://www.' + `${env.HOST}:${env.HTTP_PORT}`
      + `/verify/${user.id}/${res.locals.token}`,
  };
  email.send(data)
    .then( () => {
      user.verReqTimestamp = new Date().getTime();
      res.json(`message: Email verification request sent to ${user.email}. `
         +     'Please check your inbox...');
    })
    .catch( err => {
      let error = new Error(`Failed to send email verification request`);
      if (env.NODE_ENV === 'development') error.dev = err;
      return next(error);
    });
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
    if (env.NODE_ENV === 'development') error.dev = err;
    return next(error);
  }
}

export default router;
