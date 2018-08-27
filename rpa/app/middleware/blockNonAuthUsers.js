/* block non-auth users middleware
============================================================================= */

/**
 * Checks if the user is logged in and authorised (auth set to true).
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   pass the request to the next middleware on success.
 *                           redirect to homepage otherwise.
 */
export function blockNonAuthUsers(req, res, next) {
  /** check if session exists */
  if (!req.session) {
    let error = new Error(
      'No user session found, if you suspect '
      + 'your connection was lost, please login and try again.');
    error.status = 412;
    return next(error);
  }

  /** else if user is authenticated, pass to the next middleware */
  else if (req.session.auth) return next();

  /** else redirect with an error */
  else {
    req.session.flash = {
      message:'Unauthorised: Please login before accessing protected resources.'
    };
    req.session.redirect = req.originalUrl;
    return res.redirect('/login');
  }
}
