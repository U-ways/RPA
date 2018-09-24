/* graphiql controller
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
 * Render the graphiql.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render graphiql on success, error resposne otherwise
 */
function getLogic (req, res, next) {
  return res.render(`app/${fileName}`, (err, html) => {
    let meta = {
      flash: res.locals.flash,
    };
    return res.json({ html, meta });
  });
}

export default router;
