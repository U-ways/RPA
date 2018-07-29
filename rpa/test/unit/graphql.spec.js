/* GraphQL Sepc
============================================================================= */
import mongoose from 'mongoose';
import dotenv   from 'dotenv/config';
import cl       from '../../modules/colorLogger.js';
import { describe, before, after, it } from 'mocha';

describe.only('/graphql', () => {

  /** Connect and clean database **/

  before(() => {
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

  after(() => {
    mongoose.connection.close(() =>
    console.log(cl.warn, '    Connection closed'));
  });

  /** Store API tests **/

  describe.only('Store', () => {
    let test = require(`./graphql/Store.test.js`);

    describe('types', () => {
      it('should have the correct value for each field', test.types);
    })

    describe('queries', () => {
      // before(() => { test.addFakeData })
      // after(()  => { test.cleanFakeData })

      // it('should resolve', test.find);
      // it('should resolve', test.findAll);
    })

    describe('mutations', () => {
      beforeEach(() => { test.addFakeData })
      afterEach(()  => { test.cleanFakeData })

      it('should resolve createStore by returning the new store', test.create);
      it('should resolve updateStore by returning the updated store', test.update);
      it('should resolve deleteStore by returning the deleted store', test.remove);
    })
  });

  /** User API tests **/

  describe('User', () => {
    let test = require(`./graphql/User.test.js`);

    describe('types', () => {
      it('should have correct values for each field', test.types);
    })

    describe('queries', () => {
      it('should test', test.sth);
      it('should test', test.sth);
    })

    describe('mutations', () => {
      it('should test', test.sth);
      it('should test', test.sth);
    })
  });

});
