/* dashboard controller
============================================================================= */

import path from 'path';

import { Router } from 'express';
import { blockNonAuthUsers } from './../../middleware/blockNonAuthUsers.js';

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
 * Render the dashboard.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render dashboard on success, error resposne otherwise
 */
function getLogic (req, res, next) {
  let view = {
    title: fileName,
    stylesheets: [
      `stylesheets/${fileName}.css`
    ],
    scripts: [
      `scripts/${fileName}.js`,
    ],
    flash:   res.locals.flash,
    message: res.locals.message,
    session: req.session,
  };

  return res.render(fileName, view);
}

export default router;
