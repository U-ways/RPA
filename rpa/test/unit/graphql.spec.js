/* GraphQL Sepc
============================================================================= */
import mongoose from 'mongoose';
import dotenv   from 'dotenv/config';
import cl       from '../../modules/colorLogger.js';
import { describe, before, after, it } from 'mocha';

describe('/graphql', () => {

  /** Connect and clean database **/

  before('connect to database', () => {
    console.log(cl.act, '    Connecting to DB');
    let options  = { useNewUrlParser: true };
    return mongoose.connect(process.env.DB_URI_ADMIN, options).then(
      mongoose => {
        console.log(cl.ok, '    Connected to database');
        console.log(cl.warn, '    Cleaning database\n');
        return mongoose.connection.db.dropDatabase();
      },
      error => { console.log(cl.err,`    Database: ${error.message}`); }
    )
  });
  after('disconnect from database', () => {
    mongoose.connection.close(() =>
    console.log(cl.warn, '    Connection closed'));
  });

  /** Store API tests **/

  describe('Store', () => {
    let test = require(`./graphql/Store.test.js`);

    describe('types', () => {
      it('should have the correct value for each field', test.types);
    })

    describe('queries', () => {
      beforeEach('add fake data', test.addFakeData);
      afterEach('clean database', test.cleanDatabase);

      it('findStore by returning the found store', test.find);
      it('findAllStores by returning an array of found stores', test.findAll);
    })

    describe('mutations', () => {

      beforeEach('add fake data', test.addFakeData);
      afterEach('clean database', test.cleanDatabase);

      it('createStore by returning the new store', test.create);
      it('updateStore by returning the updated store', test.update);
      it('deleteStore by returning the deleted store', test.remove);
    })
  });

  /** User API tests **/

  describe('User', () => {
    let test = require(`./graphql/User.test.js`);

    describe('types', () => {
      it('should have the correct value for each field', test.types);
    })

    describe('queries', () => {
      beforeEach('add fake data', test.addFakeData);
      afterEach('clean database', test.cleanDatabase);

      it('findUser by returning the found user', test.find);
      it('findAllUsers by returning an array of found users', test.findAll);
    })

    describe('mutations', () => {

      beforeEach('add fake data', test.addFakeData);
      afterEach('clean database', test.cleanDatabase);

      it('createUser by returning the new user', test.create);
      it('updateUser by returning the updated user', test.update);
      it('deleteUser by returning the deleted user', test.remove);
    })
  });

});
