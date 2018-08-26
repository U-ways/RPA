/* database service
============================================================================= */

import mongoose      from 'mongoose';
import { UserModel } from '../../mvc/models/User.js';
import { cl }        from '../../../lib/colorLogger.js';

const ENV = process.env;

/* static database accounts
============================================================================= */

/** Root account is used for administration. */
const createAdmin = () => {
  const Admin = new UserModel({
    username: ENV.ADMIN_USERNAME,
    password: ENV.ADMIN_PASSWORD,
    email:    ENV.ADMIN_EMAIL,
    logs: [{ activity: 2, description: 'register root account' }],
  }).save( (err, admin) => {
    /** verify email address after creating account */
    admin.verified = true; admin.save();
    cl.ok(`[database] created root account: `
      +   `${admin.username} (email: ${admin.email})`);
  });
};

/** Bot account is used for mailing and user verification. */
const createBot = () => {
  const Bot = new UserModel({
    username: ENV.BOT_USERNAME,
    password: ENV.BOT_PASSWORD,
    email:    ENV.BOT_EMAIL,
    logs: [{ activity: 2, description: 'register bot account' }]
  }).save( (err, bot) => {
    cl.ok(`[database] created bot account: `
      +   `${bot.username} (email: ${bot.email})`);
  });
};

/**  Check if root and bot accounts exist, if not create missing accounts. */
function createAccounts () {
  /** check if admin account already exsits in the DB */
  return UserModel.find({
    $or: [{username: ENV.ADMIN_USERNAME}, {username: ENV.BOT_USERNAME}]
  })
  .then( accounts => {
    if (accounts.length === 2) {
      cl.warn(`[database] skipping root & bot account creation: `
        +     `${ENV.ADMIN_USERNAME} & ${ENV.BOT_USERNAME} already exists.`);
      return createBot();
    }
    else if (accounts.length === 1) {
      if (accounts[0].username === ENV.ADMIN_USERNAME) {
        cl.warn(`[database] skipping root account creation: `
          +     `${ENV.ADMIN_USERNAME} already exists.`);
        return createBot();
      }
      else {
        cl.warn(`[database] skipping bot account creation: `
          +     `${ENV.BOT_USERNAME} already exists.`);
        return createAdmin();
      }
    }
    /** else both account don't exist, create new admin and bot accounts */
    else createBot(), createAdmin();
  })
  .catch( err => {
    cl.err(`[database] unable to create accounts - ${err.message}`);
    process.exit(1);
  });
}

/* database connection
============================================================================= */

/** options for mongoose connection */
const options  = {
  useNewUrlParser: true
};

/** Development environment database */

function connectToDevelopment () {
  return mongoose
  .connect(ENV.DEV_DB_URI_ADMIN, options)
  .then( mongoose => {
    cl.ok('[database] connected to development database');
    return mongoose.connection.db.dropDatabase( () => {
      cl.warn('[database] flushed development database');
      return createAccounts();
    });
  })
  .catch( err => {
    cl.err(`[database] ${err.message}`);
    process.exit(1);
  });
}

/** Production environment database */

function connectToProduction () {
  return mongoose
  .connect(ENV.PRO_DB_URI_USER, options)
  .then( () => {
    cl.ok('[database] connected to production database');
    return createAccounts();
  })
  .catch( err => {
    cl.err(`[database] ${err.message}`);
    process.exit(1);
  });
}

/** export database methods as an object for convenience */

export const database = {
  connectToDevelopment: connectToDevelopment,
  connectToProduction:  connectToProduction,
}
