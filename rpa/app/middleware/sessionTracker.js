/* sessionTracker middleware
============================================================================= */

import session      from 'express-session';
import redis        from 'redis';
import connectRedis from 'connect-redis';

const env = process.env;

/**
 * Track users by creating a session tracker for each connection
 * by sending a session-cookie for each new connection and the
 * browser will send it back with each subsequent request.
 *
 * The session store used is redis:
 * https://redis.io/commands
 *
 * @return {cookie}  a session-cookie to track user connection
 */
export function sessionTracker () {
  const redisClient = redis.createClient();
  const RedisStore  = connectRedis(session);

  let secret  = [
    env.SECRET_1,
    env.SECRET_2,
    env.SECRET_3 ];
  let storeOptions = {
    host: env.HOST,
    port: parseInt(env.REDIS_PORT),
    client: redisClient,
    logErrors: env.NODE_ENV === 'development' ? true : false
  }
  let options = {
    name: 'RPA_session_cookie',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore(storeOptions),
    cookie: {
      path: '/',
      secure: false,
      maxAge: 5 * 60 * 1000, // 5 minutes
    }
  }

  return session(options);
};
