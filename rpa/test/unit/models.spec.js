/* Models Sepc
============================================================================= */

import mongoose from 'mongoose';
import dotenv   from 'dotenv/config';

import { describe, before, after, it } from 'mocha';

const env = process.env;

describe('/models', () => {

  /** Connect and clean database **/

  before('connect to database', () => {
    let options  = { useNewUrlParser: true };
    return mongoose.connect(env.DEV_DB_URI_ADMIN, options).then(
      mongoose => {
        console.info('    Connected to database');
        console.warn('    Cleaning database\n');
        return mongoose.connection.db.dropDatabase();
      },
      error => { console.error(`    Database: ${error.message}`); }
    )
  });
  after('disconnect from database', () => {
    mongoose.connection.close(() => console.warn('    Connection closed'));
  });

  /** Store model tests **/

  describe('Store', () => {
    let test = require(`./models/Store.test.js`);
    it('should pass valid documents', test.valid);
    it('should reject invalid documents', test.invalid);
    it('should invalidate postcode incorrect format', test.invalidPostcode);
  });

  /** Product model tests **/

  describe('Product', () => {
    let test = require(`./models/Product.test.js`);
    it('should pass valid documents', test.valid);
    it('should reject invalid documents', test.invalid);
    it('should allow default date', test.defaultDate);
    it('should invalidate negative units sold', test.negativeSold);
  });

  describe('User', () => {
    let test = require(`./models/User.test.js`);
    it('should pass valid documents', test.valid);
    it('should reject invalid documents', test.invalid);
    it('should invalidate username incorrect format', test.invalidUsername);
    it('should invalidate password incorrect format', test.invalidatePassword);
    it('should invalidate email incorrect format', test.invalidEmail);
  });

  /** Log model tests **/

  describe('Log', () => {
    let test = require(`./models/Log.test.js`);
    it('should pass valid documents', test.valid);
    it('should reject invalid documents', test.invalid);
    it('should invalidate non-enum activity', test.invalidActivity);
    it('should set date by default', test.defaultDate);
  });

});
