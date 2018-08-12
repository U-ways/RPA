import { createClient as redisClient } from 'redis';

/**
 * Prevent session duplication by checking if the user already have an active
 * stored session within its own instance.
 *
 * If a session exist, check if it is still valid (not timed out).
 * Return an error if session is active to prevent session duplication.
 *
 * @param  {request}   req   request object
 * @param  {response}  res   response object
 * @param  {Function}  next  callback to the next middleware
 * @return {next}            pass to next middleware on success,
 *                           pass to error middleware otherwise.
 */
export function preventSessionDuplication (req, res, next) {
  /** current logged-in user */
  let user = res.locals.user;

  /**
   * before starting an authenticated session for user,
   * check if the user had already stored an authenticated session ID.
   */
  if (user.sessionID) {
    /** if so, get the stored values of that session ID */
    return redisClient().get(`sess:${user.sessionID}`, (err, session) => {
      session = JSON.parse(session);
      /**
       * then check if the stored session-key is active and
       * still belongs to the same user.
       */
      if (session && session.user && (session.user.username === user.username)) {
        let error = new Error(
          'You\'re already logged-in. '
          + 'Please request a password reset if this is not you.');
        error.status = 401;
        return next(error);
      }
      /**
       * else user have no active session; the user had their session timed-out.
       * thus remove the stored session ID and let them start a new session.
       */
      else {
        user.sessionID = null;
        return next();
      }
    });
  }

  return next();
}
