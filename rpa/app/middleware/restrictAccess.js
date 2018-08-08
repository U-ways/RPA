/* Restrict-access middleware
============================================================================= */

/**
 * Checks if the user is logged in and authorised (auth set to true).
 * It will pass the pass the request to the next middleware on success,
 * redirect to homepage otherwise.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        pass the request to the next middleware on success.
 *                           redirect to homepage otherwise.
 */
export function restrictAccess(req, res, next) {
  /** check the session connection */
  if (!req.session) {
    return res.status(412)
      .json({ error: 'No user session found, if you suspect '
        + 'your connection was lost, please login and try again.' });
  }

  /** if authenticated pass to the next middleware */
  if (req.session.auth) return next();

  /** else redirect with an error */
  else {
    req.session.temp = {
      status: 401,
      message:'unauthorised: please login to access protected resources.'
    }
    return res.redirect('/');
  }
}
