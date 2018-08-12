/**
 * This is a middleware to allow passing user session flash errors and feedback
 * form the response's `locals` object (res#locals) on redirection.
 *
 * This method is also known as "flash messaging"
 *
 * **Problem** - whenever you redirect as a response, you start a new request,
 * and thus the response and request `locals` are all reset.
 *
 * **solution** - hold the error and feedback data within the session store,
 * and pass the data within response `locals` for the redirection request,
 * then manually garbage collect to preserve memory.
 *
 * **Usage Example** - whenever you need to do a response redirection and need
 * to pass an error or a feedback to the redirected URL pass the values as a
 * session `flash` property like so:
 *
 * ```js
 * req.session.flash = {
 *   status: 400,
 *   message: 'user already logged out: no active session found to destroy.'
 * };
 *
 * req.session.flash = {
 *   status: 200,
 *   message: 'success: you\'ve securely logged out.'
 * };
 * ```
 *
 * And access the values within response `locals` as if they belonged there:
 *
 * ```js
 * let error    = res.locals.flash.error;
 * let feedback = res.locals.flash.feedback;
 * ```
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        returns the request to the next middleware when done.
 */
export function flashMessages (req, res, next) {
  /** pass each object in flash to `res.locals` */
  if (req.session.flash) {
    let temp  = {};
    let flash = req.session.flash;

    for (let key of Object.keys(flash)) {
      temp[key] = flash[key];
    }

    res.locals.flash = temp;
    /**
     * Allow property `flash` to be eligible for garbage collection
     * by setting its value to null.
     */
    req.session.flash = null;
    // IDEA: if no user destory the whole session?
    return next();
  }
  return next();
}
