import express from 'express';
const  router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let view = {
    title: 'dashboard',
    id:    req.session.user.id,
    user:  req.session.user.username,
    email: req.session.user.email,
  }

  res.render('dashboard', view);
});

export default router;
