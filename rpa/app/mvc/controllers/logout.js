/* logout controller
============================================================================= */
import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.id) {
    req.session.destroy(() => {
      console.log('session destroyed');
      res.redirect('/');
    });
  } else {
    let error = new Error(`User already logged out; No session found to destroy.`);
    error.name = 'Bad Request';
    error.status = 400;
    return next(error);
  }
});

export default router;
