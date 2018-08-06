/* registration controller
============================================================================= */

import express from 'express';
import { UserModel } from '../models/User.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('register', { title: 'register' });
});

router.post('/', registerUser, (req, res, next) => {
  let user = req.locals.user;

  /** Create new session for registered user */
  req.session.regenerate(err => {
    if (err) return next(err);

    req.session.auth = true;
    req.session.new  = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    /** increase to 30 minutes for authenticated users */
    req.session.cookie.maxAge = 30 * 60 * 1000, //

    user.logs.push({
      activity: 0,
      description: 'user registered'
    });
    user.save().then(user => {
      res.redirect('/dashboard');
    });

  });
});

/* logic
============================================================================= */

function registerUser (req, res, next) {
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  UserModel.find({ $or: [{username: username}, {email: email}] })
  .then(docs => {
    if (docs.length > 1) {
      return res.status(409)
        .json({ error: 'Username and email already exists.' });
    }
    else if (docs.length === 1) {
      let duplicate = (docs[0].username === username) ? 'Username' : 'Email';
      return res.status(409)
        .json({ error: `${duplicate} already exists.` });
    }
    else {
      let createUser   = UserModel.create({
        username: username,
        password: password,
        email:    email
      });
      let hashPassword = createUser.then(user => {
        let hash = user.hashPassword(password);
        return hash.then(
          hashedPassword => {
            user.password = hashedPassword;
            return user.save();
          });
        }
      );
      hashPassword.then(user => {
        req.locals = { user: user };
        return next();
      });
    }
  })
  .catch(err => {
    return res.status(500)
      .json({ error: 'Unable to verify if username and email already taken.' });
  });
}

export default router;
