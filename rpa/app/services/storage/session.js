/* session
============================================================================= */

import redis  from 'redis';

const redisClient = redis.createClient();

/** delete all existing keys within redis */
function flushSessionStore () {
  return redisClient.flushall('ASYNC', (err, success) => {
    if (err) {
      console.error(`[store] unable to flush existing session store`);
      console.error(`[store] reason: ${err}`);
      return process.exit(1);
    }
    else return console.warn('[store] flushed redis session store');
  });
}


/** export memory methods as an object for convenience */

export const session = {
  flush: flushSessionStore,
}
