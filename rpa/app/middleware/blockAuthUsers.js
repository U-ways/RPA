/* block auth users middleware
============================================================================= */

/**
 * Block route access to already logged in users.
 *
 * This middleware is used to prevent actions that require the user
 * to be logged out. (i.e. login, registration...etc.)
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   pass request to the next middleware on success.
 *                           redirect to dashboard otherwise.
 */
export function blockAuthUsers (req, res, next) {
  /** Check if user is authenticated (logged in) */
  if (req.session && req.session.auth) {
    return res.status(400).redirect('/app');
  }
  else return next();
}
