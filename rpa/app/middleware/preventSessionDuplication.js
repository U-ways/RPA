import { createClient } from 'redis';
 
/**
 * Prevent session duplication by checking if the user already have an active
 * stored session within its own instance.
 *
 * If a session exist, check if it is still valid (not timed out).
 * If so, destory that session and create a new session for that user.
 *
 * If session is timed-out, remove the stored session ID and let them start a
 * new session.
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
    const redisClient = createClient();
    /** if so, get the stored values of that session ID */
    return redisClient.get(`sess:${user.sessionID}`, (err, session) => {
      session = JSON.parse(session);
      /**
       * then check if the stored session-key is active and
       * still belongs to the same user.
       */
      if (session && session.user && (session.user.username === user.username)) {
        /** if so, remove that key and let them create a new session. */
        redisClient.del(`sess:${user.sessionID}`);
        user.sessionID = null;
        return next();
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
