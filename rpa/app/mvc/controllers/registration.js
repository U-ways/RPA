/* registration controller
============================================================================= */
import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

router.get('/', function(req, res) {
  res.render('register', { title: 'register' });
});

function registerUser (req, res, next) {
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  UserModel.find({ $or: [{username: username}, {email: email}] })
  .then(
    docs => {
      if (docs.length > 1) {
        let error = new Error('Username and email already exists.');
        error.name = 'Conflict';
        error.status = 409;
        next(error);
      }
      else if (docs.length === 1) {
        let duplicate = (docs[0].username === username) ? 'Username' : 'Email';
        let error = new Error(`${duplicate} already exists.`);
        error.name = 'Conflict';
        error.status = 409;
        next(error);
      }
      let createUser   = UserModel.create({
        username: username,
        password: password,
        email:    email
      });
      let hashPassword = createUser.then(
        user => {
          let hash = user.hashPassword(password);
          return hash.then(
            hashedPassword => {
              user.password = hashedPassword;
              return user.save();
            }
          );
        }
      );
      hashPassword.then(
        user => {
          req.locals = {
            user: {
              id: user._id,
              username: user.username,
              email:    user.email
            }
          }
          next();
        }
      );
    }
  )
  .catch(
    err => {
      let error = new Error('Unable to verify if username and email already taken.');
      error.name = 'Internal Server Error';
      error.status = 500;
      error.caught = err;
      next(error);
    }
  );
}

router.post('/', registerUser, (req, res, next) => {
  // Create new session for registered user
  req.session.regenerate(err => {
    if (err) return next(err);
    req.session.auth = true;
    req.session.new  = true;
    req.session.user = req.locals.user;
    req.session.cookie.maxAge = 30 * 60 * 1000, // increase to 30 minutes
    res.redirect('/dashboard');
  })
});

export default router;
