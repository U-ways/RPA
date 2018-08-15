/* database service
============================================================================ */

import mongoose from 'mongoose';
import cl from '../../lib/colorLogger.js';

const ENV = process.env;

/* admin account
============================================================================ */

/**
 * Create root administration so there will always be a way to access the DB.
 */
function createAdmin () {
  return import('../mvc/models/User.js')
  .then( ({ UserModel }) => {
    /** check if admin account already exsits in the DB */
    UserModel.findOne({username: ENV.ADMIN_USERNAME})
    .then( admin => {
      if (admin !== null) {
        console.log(cl.warn,`[database] skipping root account creation: `
          + `${ENV.ADMIN_USERNAME} already exists.`);
      }
      /** if not, create a new admin account */
      else {
        UserModel.create({
          username: ENV.ADMIN_USERNAME,
          password: ENV.ADMIN_PASSWORD,
          email:    ENV.ADMIN_EMAIL,
          logs: [{ activity: 0, description: 'root registration' }]
        })
        .then( admin => {
          console.log(cl.ok, `[database] created root username: `
            + `${admin.username} - email: ${admin.email}`);
        });
      }
    });
  })
  .catch( err => {
    console.log(cl.err,`[database] unable to create ADMIN - ${err.message}`);
    process.exit(1);
  });
}

/* database connection
============================================================================ */

/** options */
const options  = {
  useNewUrlParser: true
};

/** Development environment database */

function connectToDevelopment () {
  console.log(cl.act, '[database] connecting...');

  return mongoose
  .connect(ENV.DEV_DB_URI_ADMIN, options)
  .then( mongoose => {
    console.log(cl.ok, '[database] connected to development database');
    return mongoose.connection.db.dropDatabase( () => {
      console.log(cl.warn, '[database] flushed development database');
      return createAdmin();
    });
  })
  .catch( err => {
    console.log(cl.err,`[database] ${err.message}`);
    process.exit(1);
  });
}

/** Production environment database */

function connectToProduction () {
  console.log(cl.act, '[database] connecting...');

  return mongoose
  .connect(ENV.PRO_DB_URI_USER, options)
  .then( () => {
    console.log(cl.ok, '[database] connected to production database');
    return createAdmin();
  })
  .catch( err => {
    console.log(cl.err,`[database] ${err.message}`);
    process.exit(1);
  });
}

/** export database methods as an object for convenience */

export const database = {
  connectToDevelopment: connectToDevelopment,
  connectToProduction:  connectToProduction,
}
