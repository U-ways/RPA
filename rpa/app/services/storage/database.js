/* database service
============================================================================= */

import mongoose      from 'mongoose';

import { UserModel } from '../../mvc/models/User.js';

/* static database accounts
============================================================================= */

/** Root account is used for administration. */
const createAdmin = () => {
  const admin = new UserModel({
    username: process.env.ADMIN_USERNAME,
    email:    process.env.ADMIN_EMAIL,
    'security.password': process.env.ADMIN_PASSWORD,
    logs: [{ activity: 2, description: 'register root account' }],
  }).save( (err, admin) => {
    /** verify email address after creating account */
    admin.security.verified = true; admin.save();
    console.info(`[database] created root account: `
      +   `${admin.username} (email: ${admin.email})`);
  });
};

/** Bot account is used for mailing and user verification. */
const createBot = () => {
  const bot = new UserModel({
    username: process.env.BOT_USERNAME,
    email:    process.env.BOT_EMAIL,
    'security.password': process.env.BOT_PASSWORD,
    logs: [{ activity: 2, description: 'register bot account' }]
  }).save( (err, bot) => {
    bot.security.verified = true; bot.save();
    console.info(`[database] created bot account: `
      +   `${bot.username} (email: ${bot.email})`);
  });
};

/**  Check if root and bot accounts exist, if not create missing accounts. */
function createAccounts () {
  /** check if admin account already exsits in the DB */
  return UserModel.find({
    $or: [
      {username: process.env.ADMIN_USERNAME},
      {username: process.env.BOT_USERNAME}
    ]
  })
  .then( accounts => {
    if (accounts.length === 2) {
      console.warn(`[database] skipping root & bot account creation: `
        + `${process.env.ADMIN_USERNAME} & ${process.env.BOT_USERNAME} already exists.`);
      return createBot();
    }
    else if (accounts.length === 1) {
      if (accounts[0].username === process.env.ADMIN_USERNAME) {
        console.warn(`[database] skipping root account creation: `
          + `${process.env.ADMIN_USERNAME} already exists.`);
        return createBot();
      }
      else {
        console.warn(`[database] skipping bot account creation: `
          + `${process.env.BOT_USERNAME} already exists.`);
        return createAdmin();
      }
    }
    /** else both account don't exist, create new admin and bot accounts */
    else createBot(), createAdmin();
  })
  .catch( err => {
    console.error(`[database] unable to create accounts - ${err.message}`);
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
  .connect(process.env.DEV_DB_URI_ADMIN, options)
  .then( mongoose => {
    console.info('[database] connected to development database');
    return mongoose.connection.db.dropDatabase( () => {
      console.warn('[database] flushed development database');
      // TEMP
      // let StoreData = require(`../../../test/unit/graphql/Store.test.js`);
      // let UserData = require(`../../../test/unit/graphql/User.test.js`);
      // StoreData.addFakeData()
      // UserData.addFakeData()
      return createAccounts();
    });
  })
  .catch( err => {
    console.error(`[database] ${err.message}`);
    process.exit(1);
  });
}

/** Production environment database */

function connectToProduction () {
  return mongoose
  .connect(process.env.PRO_DB_URI_USER, options)
  .then( () => {
    console.info('[database] connected to production database');
    return createAccounts();
  })
  .catch( err => {
    console.error(`[database] ${err.message}`);
    process.exit(1);
  });
}

/** export database methods as an object for convenience */

export const database = {
  connectToDevelopment: connectToDevelopment,
  connectToProduction:  connectToProduction,
}
