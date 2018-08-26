/* index controller
============================================================================= */

import path from 'path';

import { Router    } from 'express';
import { reCaptcha } from '../../middleware/reCaptcha.js';

const router = Router();

router.get('/', reCaptcha.middleware.render, getLogic);

/* logic
============================================================================= */

/** get current file name and remove extension */
const FILE_NAME = path.basename(__filename).slice(0, -3);

/**
 * Render the landing page.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render landing page on success, error resposne otherwise.
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
      'scripts/login.js',
      `scripts/${FILE_NAME}.js`
    ],
    flash: res.locals.flash,
    message: res.locals.message,
    captcha: res.recaptcha,
    session: req.session,
  };

  return res.render(FILE_NAME, view);
}

export default router;
