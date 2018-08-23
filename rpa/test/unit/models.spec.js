/* Models Sepc
============================================================================= */
import mongoose from 'mongoose';
import dotenv   from 'dotenv/config';
import { cl }   from '../../lib/colorLogger.js';
import { describe, before, after, it } from 'mocha';

describe('/models', () => {

  /** Connect and clean database **/

  before('connect to database', () => {
    cl.act('    Connecting to DB');
    let options  = { useNewUrlParser: true };
    return mongoose.connect(process.env.DEV_DB_URI_ADMIN, options).then(
      mongoose => {
        cl.ok('    Connected to database');
        cl.warn('    Cleaning database\n');
        return mongoose.connection.db.dropDatabase();
      },
      error => { cl.err(`    Database: ${error.message}`); }
    )
  });
  after('disconnect from database', () => {
    mongoose.connection.close(() => cl.warn('    Connection closed'));
  });

  describe('Store', () => {
    let test = require(`./models/Store.test.js`);
    it('should pass valid documents', test.valid);
    it('should reject invalid documents', test.invalid);
    it('should invalidate postcode incorrect format', test.invalidPostcode);
  });

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
    it('should invalidate password incorrect format', test.invalidPassword);
    it('should invalidate email incorrect format', test.invalidEmail);
  });

  describe('Log', () => {
    let test = require(`./models/Log.test.js`);
    it('should pass valid documents', test.valid);
    it('should reject invalid documents', test.invalid);
    it('should invalidate non-enum activity', test.invalidActivity);
    it('should set date by default', test.defaultDate);
  });

});
