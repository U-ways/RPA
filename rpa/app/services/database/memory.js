/* memory
============================================================================= */

import { cl } from '../../../lib/colorLogger.js';
import redis  from 'redis';

const redisClient = redis.createClient();

/** delete all existing keys within redis */
function flushSessionStore () {
  return redisClient.flushall('ASYNC', (err, success) => {
    if (err) {
      cl.err(`[store] unable to flush existing session store`);
      cl.err(`[store] reason: ${err}`);
      return process.exit(1);
    }
    else return cl.warn('[store] flushed redis session store');
  });
}


/** export memory methods as an object for convenience */

export const memory = {
  flush: flushSessionStore,
}
