/* settings controller
============================================================================= */

import path from 'path';

import { Router } from 'express';
import { blockNonAuthUsers } from '../../../../middleware/blockNonAuthUsers.js';
import { UserModel } from '../../../models/User.js';

const router = Router();

router.get('/',
  blockNonAuthUsers,
  getLogic,
);

/* logic
============================================================================= */

/** get current file name and remove extension */
const fileName = path.basename(__filename).slice(0, -3);

/**
 * Render the settings.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render settings on success, error resposne otherwise
 */
async function getLogic (req, res, next) {
  
  /** find the user with the active session */
  let user = await UserModel.findById(req.session.user.id);
  
  let view = {
    session: req.session,
    verfied: user.security.verified,
    key: user.security.apiKey,
    log: user.getLogs(10),
    lastLogin: user.getLastLoginDate(),
  };

  return res.render(`app/${fileName}`, view, (err, html) => {
    // stylesheets and scripts to append to the <head>
    let meta = {
      stylesheets: [
        `stylesheets/app/${fileName}.css`
      ],
      scripts: [
        `scripts/app/${fileName}.js`,
      ],
      flash: res.locals.flash,
    };

    return res.json({ html, meta });
  });

}

export default router;
