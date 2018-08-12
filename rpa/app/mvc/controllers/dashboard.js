/* dashboard controller
============================================================================= */

import path from 'path';
import express from 'express';

const  router = express.Router();

router.get('/', getLogic);

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
      `scripts/${FILE_NAME}.js`
    ],
    flash: res.locals.flash,
    message: res.locals.message,
    user: req.session.user,
    sessionID: req.session.id,
  };

  return res.render(FILE_NAME, view);
}

export default router;
