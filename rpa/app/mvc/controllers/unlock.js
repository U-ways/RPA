/* unlock controller
============================================================================= */

import { Router    } from 'express';
import { UserModel } from '../models/User.js';
import { blockAuthUsers } from '../../middleware/blockAuthUsers.js';

const router = Router();

router.get('/:id/:token',
  blockAuthUsers,
  unlockUser,
);

/**
 * Terminate user's locked session by checking token requested validity.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        redirect on success, respond with an error otherwise
 */
async function unlockUser (req, res, next) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (!user) throw new Error('User id doesn\'t exist');

    /** check if user is not locked */
    if (!user.security.lockedUntil) {
      let error = new Error('User session is not locked');
      error.status = 400;
      return next(error);
    }

    /** check if token requested is valid */
    let validate = await user.validateToken(req.params.token);
    if (!validate) throw new Error('Invalid token value');

    /** terminate locked session */
    user.security.lockedUntil = null;
    /** remove security token */
    user.security.token = null;

    /** log user activity and then redirect to landing page */
    user.createLog('UPDATE', 'Reset user login attempts');
    user.save();

    req.session.flash = {
      message: 'You\'ve successfully terminated your account\'s locked session.'
    };
    res.redirect('/');
  }
  catch (err) {
    let error = new Error(
      'Failed to terminate locked user session.'
      + 'If your account is still locked, please request a password reset.'
    );
    error.dev = err;
    error.status = 400;
    return next(error);
  }
}

export default router;
