import express from 'express';
const  router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session) {
    console.log(req.session.id);
    console.log(req.session.user);
  }
  res.render('index', { title: 'RPA' });
});

export default router;
