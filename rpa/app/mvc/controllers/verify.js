/* IDEA: verify controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';
import { authenticateUser } from '../../middleware/authenticateUser.js';

const router = express.Router();

router.get('/', verifyEmail);

// TODO: use https://nodemailer.com/about/
function verifyEmail (req, res, next) {
  req.session.temp = {
    status: 200,
    message:'success: you\'ve successfully verified your email.'
  };
  return res.redirect('/');
}

export default router;
