/* dashboard controller
============================================================================= */

import path from 'path';
import { Router } from 'express';

<<<<<<< HEAD
import { restrictAccess } from './../../middleware/restrictAccess.js';
=======
import { restrictAccess } from './middleware/restrictAccess.js';
>>>>>>> ce4f0abd96633db6fd75fdb0042a0e94a24b757b

const  router = Router();

router.get('/', restrictAccess, getLogic);

/* logic
============================================================================= */

/** get current file name and remove extension */
const FILE_NAME = path.basename(__filename).slice(0, -3);

/**
 * Render the dashboard.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render dashboard on success, error resposne otherwise.
 */
function getLogic (req, res, next) {
  let view = {
    title: FILE_NAME,
    stylesheets: [
      'iconfont/material-icons.css',
      'stylesheets/core.css',
      `stylesheets/${FILE_NAME}.css`
    ],
    scripts: [
      'scripts/core.js',
      `scripts/${FILE_NAME}.js`,
    ],
    flash: res.locals.flash,
    message: res.locals.message,
    session: req.session,
  };

  return res.render(FILE_NAME, view);
}

export default router;
