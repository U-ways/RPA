/* index controller
============================================================================= */

import express from 'express';

const  router = express.Router();

router.get('/', getLogic);

export default router;

/* logic
============================================================================= */

/**
 * Render the home page.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        render login page on success, error resposne otherwise.
 */
function getLogic (req, res, next) {
  let view = {
    title: 'Homepage',
    message: res.locals.message,
  };

  res.status(res.locals.status || 200);
  res.render('index', view);
}
