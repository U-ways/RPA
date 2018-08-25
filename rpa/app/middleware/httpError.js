/* httpError middleware
============================================================================ */

const ENV = process.env;

/**
 * catch 404 (not found) errors and render the 404 view
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {response}        redirect to 404 error page.
 */
function notFound404 (req, res, next) {
  let view = {
    title: `404 - Page Not Found`,
    stylesheets: [
      'iconfont/material-icons.css',
      'stylesheets/core.css',
      `stylesheets/404.css`
    ],
    message: 'No resource found matching the request-URI.',
    user: req.session.user,
  };
  return res.status(404).render('404', view);
};

/**
 * This is the end of stack error handler, it will catch any errors
 * that no other error handlers caught and display the error messages
 * accordingly as a JSON response.
 *
 * @param  {Error}     err   Error object
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @return {JSON}            respond with a JSON error
 */
function mainErrorHandler (err, req, res, next) {
  /** prepare response as a JSON object */
  let error = (ENV.NODE_ENV === 'development') ? {
    error: err.message,
    stack: err.stack,
    filename: err.filename,
    dev: err.dev ? { error: err.dev.message, stack: err.dev.stack } : null,
  } :
  { error: err.message };

  return res.status(err.status || 500).json(error);
};

/** export httpError methods as an object for convenience */

export const httpError = {
  404: notFound404,
  all: mainErrorHandler,
}
