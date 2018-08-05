/* login controller
============================================================================= */
import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

router.get('/', function(req, res) {
  res.render('login', { title: 'Login' });
});

/** **/

function authenticateUser (req, res, next) {
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;
  let conditions = !!username ? {username: username} : {email: email};

  UserModel.findOne(conditions, (err, user) => {
    if (err)   return next(err);
    if (!user) {
      let input = Object.keys(conditions);
      let error = new Error(`Incorrect ${input}, please try again.`);
      error.name = 'Authentication failed';
      error.status = 401;
      return next(error);
    };

    return user.validPassword(password, user.password)
    .then(match => {
      if (match) {
        req.locals = {
          user: {
            id: user._id,
            username: user.username,
            email:    user.email
          }
        }
        return next();
      } else {
        let error = new Error(`Incorrect password, please try again.`);
        error.name = 'Authentication failed';
        error.status = 401;
        return next(error);
      };
    })
    .catch(err => {
      let error = new Error(
        'Sorry, we\'re unable to validated your password.\n' +
        'This error had been logged and our staff will investigate the problem asap.');
      error.name = 'Internal Server Error';
      error.status = 500;
      error.caught = err;
      return next(error);
    });

  });
}

router.post('/', authenticateUser, (req, res, next) => {
  console.log('you\'ve logged in!');
  // Create new session for authenticated user
  req.session.regenerate(err => {
    if (err) return next(err);
    req.session.auth = true;
    req.session.user = req.locals.user;
    req.session.cookie.maxAge = 30 * 60 * 1000, // increase to 30 minutes
    res.redirect('/dashboard');
  })
});

export default router;
