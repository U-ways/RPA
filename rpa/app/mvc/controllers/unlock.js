/* unlock controller
============================================================================= */

import { Router    } from 'express';
import { UserModel } from '../models/User.js';
import { blockAuthUsers } from '../../middleware/blockAuthUsers.js';

const router = Router();
const env    = process.env;

router.get('/:id/:hash',
  blockAuthUsers,
  unlockUser,
);

async function unlockUser (req, res, next) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (!user) throw new Error('user id doesn\'t exist');

    let validate = await user.validatePassword(user.password, req.params.hash);
    if (!validate) throw new Error('invalid hash value');

    /** terminate locked session */
    user.lockedUntil = null;

    /** log user activity and then redirect to landing page */
    user.createLog('UPDATE', 'reset user login attempts');
    user.save();

    req.session.flash = {
      message: 'you\'ve successfully terminated your account\'s locked session.'
    };
    res.redirect('/');
  }
  catch (err) {
    let error = new Error('failed to terminate locked user session.');
    if (env.NODE_ENV === 'development') error.dev = err;
    error.status = 400;
    return next(error);
  }
}

export default router;
