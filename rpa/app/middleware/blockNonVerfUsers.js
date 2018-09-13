/* block non-verified users middleware
============================================================================= */

import { UserModel } from '../mvc/models/User.js';

/**
 * Checks if the logged user is verified (verified flag set to true).
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next|response}   pass the request to the next middleware on success.
 *                           redirect to dashboard otherwise.
 */
export async function blockNonVerfUsers (req, res, next) {
  /** find user by id */
  let user = await UserModel.findById(req.session.user.id).exec();

  /** if user is verified, pass to the next middleware */
  if (user.security.verified) return next();

  /** else redirect with an error */
  else {
    req.session.flash = {
      message: 'Unauthorized: You need to verify your email address to access this resource',
    };
    return res.status(401).redirect('/dashboard');
  }
}
