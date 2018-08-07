/**
 * Check if user already logged in.
 * This middleware is used to prevent actions that require the user
 * to be logged out. (i.e. login, registration...etc.)
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function | response}  pass request to the next middleware on success.
 *                                responsed with an error on failure.
 */
export function checkSession (req, res, next) {
  /** Check if user is authenticated (logged in) */
  if (req.session.auth) {
    return res.status(400)
      .json({ error: `Already logged in as ${req.session.user.username}, `
                     + 'please sign out first to processed.' });
  }

  else return next();
}
