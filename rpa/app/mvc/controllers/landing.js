/* index controller
============================================================================= */

import path from 'path';

import { Router    } from 'express';
import { reCaptcha } from '../../middleware/reCaptcha.js';

const router = Router();

router.get('/',
  reCaptcha.middleware.render,
  getLogic,
);

/* logic
============================================================================= */

/** get current file name and remove extension */
const fileName = path.basename(__filename).slice(0, -3);

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
    title: fileName,
    stylesheets: [
      `stylesheets/${fileName}.css`
    ],
    scripts: [
      `scripts/${fileName}.js`,
      'scripts/login.js',
    ],
    flash:   res.locals.flash,
    message: res.locals.message,
    captcha: res.recaptcha,
    session: req.session,
  };

  return res.render(fileName, view);
}

export default router;
