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
 * session property like so:
 *
 * ```js
 * req.session.error = {
 *   status: 400,
 *   message: 'user already logged out: no active session found to destroy.'
 * };
 *
 * req.session.feedback = {
 *   status: 200,
 *   message: 'success: you\'ve securely logged out.'
 * };
 * ```
 *
 * And you will be able to use those values by accessing response's `locals`
 * object like normal.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {Function}        returns the request to the next middleware when done.
 */
export function preserveLocalsOnRedirection (req, res, next) {
  if (req.session.error) {
    res.locals.status  = req.session.error.status;
    res.locals.message = req.session.error.message;

    delete req.session.error;
    return next();
  }

  if (req.session.feedback) {
    res.locals.status  = req.session.feedback.status;
    res.locals.message = req.session.feedback.message;

    delete req.session.feedback;
    return next();
  }

  return next();
}
