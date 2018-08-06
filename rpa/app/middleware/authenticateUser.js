/* Authenticate user middleware
============================================================================= */

import { UserModel } from '../mvc/models/User.js';

/**
 * Authenticate a client based on username (or email) and password input.
 * The function will lookup for the user requested and will test the supplemented
 * password against the user's hashed password. It will pass the control to the
 * next middleware if successful, otherwise the control is passed to an error
 * handler middleware.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        pass the request to the next middleware on success.
 *                           pass to error middleware on failure otherwise.
 */
export function authenticateUser (req, res, next) {
  let username = req.body.username,
      password = req.body.password,
      email    = req.body.email;

  /** search conditions can be username or email based on client request */
  let conditions = !!username ? {username: username} : {email: email};

  /** find user based on query conditions */
  UserModel.findOne(conditions, (err, user) => {
    if (err)   return next(err);
    if (!user) {
      let input = Object.keys(conditions);
      return res.status(401)
        .json({ error: `Incorrect ${input}, please try again.` });
    };

    /** if a user is found, attempt to validate with the requested password */
    return user.validPassword(password, user.password)
    .then(match => {
      if (match) {
        req.locals = { user: user };
        return next();
      } else {
        return res.status(401)
          .json({ error: `Incorrect password, please try again.` });
      };
    })
    .catch(err => {
      let message =
        'Sorry, we\'re unable to validated your password.\n' +
        'This error had been logged and our staff will investigate the problem asap.';
      return res.status(500)
        .json({ error: message });
    });

  });
}