/* dashboard controller
============================================================================= */

import path from 'path';

import { Router } from 'express';
import { blockNonAuthUsers } from '../../../../middleware/blockNonAuthUsers.js';

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
    // nothing needed yet
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
