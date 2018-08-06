/**
 * This is a middleware to allow passing user session errors and feedback for
 * the response's `locals` object (res#locals) on redirection.
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
 * session `temp` property like so:
 *
 * ```js
 * req.session.temp = {
 *   status: 400,
 *   message: 'user already logged out: no active session found to destroy.'
 * };
 *
 * req.session.temp = {
 *   status: 200,
 *   message: 'success: you\'ve securely logged out.'
 * };
 * ```
 *
 * And access the values within response `locals`
 * object **without** using the `temp` property:
 *
 * ```js
 * let error    = res.locals.error;
 * let feedback = res.locals.feedback;
 * ```
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        returns the request to the next middleware when done.
 */
export function sessionGarbageCollector (req, res, next) {
  /** pass each object to temp to `res.locals` */
  if (req.session.temp) {
    let temp = req.session.temp;
    for (let key of Object.keys(temp)) {
      res.locals[key] = temp[key];
    }
    /**
     * Allow property `temp` to be eligible for garbage collection
     * by setting its value to null.
     */
    req.session.temp = null;
    return next();
  }
  return next();
}
