/* Models Sepc
 ============================================================================ */
import mongoose from 'mongoose';
import dotenv   from 'dotenv/config';
import { describe, before, after, it } from 'mocha';

describe('/models', () => {

  /** Connect to DB **/
  before(() => {
    console.log('\x1b[33m','   Connecting to DB');
    let options  = { useNewUrlParser: true };
    return mongoose.connect(process.env.DB_URI, options).then(
      ()    => { console.log('\x1b[32m','   Connected to database\n');    },
      error => { console.log('\x1b[31m',`   Database: ${error.message}`); }
    );
  });

  after(() => {
    mongoose.connection.close(() =>
    console.log('\x1b[32m','   Connection closed','\x1b[0m'));
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
