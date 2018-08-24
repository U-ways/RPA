/* verify controller
============================================================================= */

import { Router    } from 'express';
import { UserModel } from '../models/User.js';
import { email     } from '../../services/email/index.js';
import { restrictAccess } from './../../middleware/restrictAccess.js';

const router = Router();
const ENV    = process.env;

router.post('/',
  // check hash posted
  // verify or deny from landing page
);

router.get('/',
  restrictAccess,
  sendVerificationEmail
  // send a rendered email with verify link
);

/* logic
============================================================================= */

function sendVerificationEmail(req, res, next) {
  const user = req.session.user;
  const data = {
    to:   { name: user.username, email: user.email,       },
    from: { name: ENV.BOT_USERNAME, email: ENV.BOT_EMAIL, },
    subject: 'RPA - Verify Email',
    code: 'hash_generated_from_password',
    text: 'verify.txt',
    html: 'verify.mst',
  };
  email.send(data)
    .then( () => {
      res.json(`email verification request sent to ${user.email}. `
         +     'Please check your inbox...');
    })
    .catch( err => {
      let error = new Error(`failed to send email verification request`);
      if (ENV.NODE_ENV === 'development') error.dev = err;
      return next(error);
    });
}

export default router;
