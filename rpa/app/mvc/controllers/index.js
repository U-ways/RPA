/* index controller
============================================================================= */

import express from 'express';

const  router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  let view = {
    title: 'RPA',
    message: res.locals.message,
  };

  res.status(res.locals.status || 200);
  res.render('index', view);
});

export default router;
