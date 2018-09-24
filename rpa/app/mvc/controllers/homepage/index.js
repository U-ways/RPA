/* index controller
============================================================================= */

import path from 'path';

import { Router    } from 'express';
import { recaptcha } from '../../../middleware/recaptcha.js';
import { blockAuthUsers } from '../../../middleware/blockAuthUsers.js';

const router = Router();

router.get('/',
  blockAuthUsers,
  recaptcha.invisible.render,
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
  return res.render('homepage/about', (err, content) => {
    let view = {
      title: 'homepage',
      stylesheets: [
        `stylesheets/homepage/${fileName}.css`,
        'stylesheets/homepage/about.css',
      ],
      scripts: [
        `scripts/homepage/${fileName}.js`,
        'scripts/homepage/login.js',
      ],
      content: content,
      flash:   res.locals.flash,
      session: req.session,
      recaptcha: res.locals.recaptcha,
    };

    return res.render(`homepage/${fileName}` , view);
  });
}

export default router;
