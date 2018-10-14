/* User Mongoose schema
============================================================================= */

import crypto   from 'crypto';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { LogSchema } from './Log.js';

/** Must starts with a letter then can include underscores (_) & hyphens (-) */
const USERNAME_REGEX = /^[a-zA-Z][\w-]+$/;
/** W3C Email regex: goo.gl/NQgCtK (Based on RFC5322) */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
/** The maximum login attempts the user can try before getting locked out */
const MAX_LOGIN_ATTEMPTS = 5;
/** 3 hours lock time */
const LOCK_TIME = 3 * 3600000;
/** 1 hour token expiry time */
const TOKEN_EXPIRY_TIME = 1 * 3600000;

const SecuritySchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'required'],
    maxlength: [100, 'max length (100) exceeded']
  },
  sessionID: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    required: [true, 'required'],
    default: false,
  },
  loginAttempts: {
    type: Number,
    required: [true, 'required'],
    min: [0, 'login attempts cannot be negative'],
    max: [MAX_LOGIN_ATTEMPTS, 'user allowed 5 invalid login attempts max'],
    default: 0,
  },
  lockedUntil: {
    type: Date,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  apiKey: {
    type: String,
    default: null
  },
});

/**
 * TODO: learn how to doc database models
 *
 * @type {Schema}
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    uniqueCaseInsensitive: true,
    unique: [true, 'already exists'],
    required: [true, 'required'],
    match: [USERNAME_REGEX, 'invalid format'],
    maxlength: [30, 'max length (40) exceeded']
  },
  email: {
    type: String,
    required: [true, 'required'],
    match: [EMAIL_REGEX, 'invalid format'],
    /** The maximum length specified in RFC 5321 **/
    maxlength: [254, 'max length (254) exceeded']
  },
  security: {
    type: SecuritySchema,
  },
  logs: [LogSchema]
});

/* User pre-save
============================================================================= */

UserSchema.pre('save', function (done) {
  let user = this;

  /** set verified as false if email been modified (or new) */
  if (user.isModified('email')) user.security.verified = false;

  /** hash password if it has been modified (or new) */
  if (user.isModified('security.password')) {
    /** salt and hash the user's password then set as user's password*/
    let hash = user.hashPassword(user.security.password);
    return hash.then(hashedPassword => {
      user.security.password = hashedPassword;
      return done();
    });
  }

  return done();
});

/* User static methods
============================================================================= */

UserSchema.statics.MAX_LOGIN_ATTEMPTS = MAX_LOGIN_ATTEMPTS;

/* User instance methods
============================================================================= */
import bcrypt from 'bcrypt';

/**
 * Creates an activity log for the user
 *
 * @param  {String} type          activity type based on enum
 * @param  {String} [description] optional description of activity
 * @return {log}
 */
function createLog (type, description) {
  let user = this;

  /** activity type as enum for easier reference */
  let activity = {
    LOGIN:  0, LOGOUT: 1,
    CREATE: 2, READ:   3,
    UPDATE: 4, DELETE: 5,
  };

  let log = {
    activity: activity[type],
    description: description
  };

  /** insert the created log into user logs */
  user.logs.push(log);

  return log;
}

/**
 * Get the user activity logs.
 * If a limit is specified, limit the logs returned by that number.
 * 
 * @param  {Number} limit how many logs to return
 * @return {Array}        user logs
 */
function getLogs (limit) {
  let logs = this.logs;
  return limit ? logs.slice(-limit) : logs;
}

/**
 * Get user's last login date.
 *
 * @return {String}  user's last login session date in UTC format
 */
function getLastLoginDate () {
  /** sort a shallow copy of user's logs */
  let logs = this.logs.slice();

  /** sort LOGIN logs ascending based on their dates */
  logs.sort((a,b) => {
    if (a.activity == 0 && b.activity != 0) return -1;
    if (a.activity != 0 && b.activity == 0) return  1;
    return (a.date > b.date) ? -1 : 1;
  });

  /** return user's last login session date */
  return new Date(logs[1].date);
}

/**
 * Increment login attempts on password failure.
 *
 * If maximum login attempts exceeded, lock account.
 *
 * @return {Promise<User>} The updated User instance
 */
function incLoginAttempts () {
  let user = this;

  /** increment login attempts and check if account got locked */
  if (++user.security.loginAttempts === MAX_LOGIN_ATTEMPTS) {
    user.security.lockedUntil   = Date.now() + LOCK_TIME;
    user.security.loginAttempts = 0;
  }

  /** save and return user */
  return user.save();
}

/**
 * A middleware to automatically hash the password
 * before it's saved to the database.
 *
 * @param  {String}  password  clear password
 * @return {promise}           hashed password
 */
function hashPassword (password) {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares both input and actual password togther
 *
 * @param  {String}  password  user input
 * @return {promise}           true if password match, false otherwise.
 *                             also returns false if errors found.
 */
function validatePassword (password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generates and appends cryptographically pseudo-random token with an
 * expiry timestamp to user security. To get timestamp from the token use:
 *
 * `let expiryTimestamp = new Date(parseInt(token.substring(0, 13), 10));`
 *
 * @return {Promise<String>}  The generated token
 */
function generateToken () {
  let user = this;

  /**
   * Generates cryptographically strong pseudo-random data with an
   * expiry timestamp. To get timestamp from the token use:
   *
   * `new Date(parseInt(token.substring(0, 13), 10))`
   */
  let GenRandBytes = new Promise( (resolve, reject) => {
    crypto.randomBytes(30, (err, buf) => {
      if (err) return reject(err);
      /** the timestamp token valid until */
      let expiryTimestamp = Date.now() + TOKEN_EXPIRY_TIME;
      /** append the expiry timestamp to token */
      let token = expiryTimestamp + buf.toString('hex');
      return resolve(token);
    });
  });

  /** add token to user security then return token */
  return GenRandBytes.then( token => {
    user.security.token = token;
    user.save();
    return token;
  });
}

/**
 * Checks if stored token is still valid (not expired) and then comapre it
 * with requested token.
 *
 * @param  {String} token  the token requested to validate
 * @return {Boolean}       true if valid, false otherwise.
 */
function validateToken (token) {
  let user = this;
  /** check if there is a token stored before proceeding with validation */
  if (!user.security.token) return false;
  /** get token expiry date @see User#createLockedSessionToken */
  let expiryTimestamp = new Date(parseInt(user.security.token.substring(0,13), 10));

  if (expiryTimestamp < Date.now()) return new Error('token expired');
  else                              return user.security.token === token;
}

UserSchema.methods.getLogs          = getLogs;
UserSchema.methods.createLog        = createLog;
UserSchema.methods.getLastLoginDate = getLastLoginDate;
UserSchema.methods.incLoginAttempts = incLoginAttempts;
UserSchema.methods.hashPassword     = hashPassword;
UserSchema.methods.validatePassword = validatePassword;
UserSchema.methods.validateToken    = validateToken;
UserSchema.methods.generateToken    = generateToken;

UserSchema.plugin(uniqueValidator);
export const UserModel = mongoose.model('User', UserSchema);
