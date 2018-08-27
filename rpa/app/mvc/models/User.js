/* User Mongoose schema
============================================================================= */

import dotenv   from 'dotenv/config';
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

/**
 * TODO: learn how to doc database models
 *
 * @type {Schema}
 */
const UserSchema = new mongoose.Schema({
  sessionID: {
    type: String,
    default: null
  },
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
  password: {
    type: String,
    required: [true, 'required'],
    maxlength: [100, 'max length (100) exceeded']
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
  },
  verified: {
    type: Boolean,
    required: [true, 'required'],
    default: false,
  },
  logs: [LogSchema]
});

/* User pre-save
============================================================================= */

UserSchema.pre('save', function (done) {
  let user = this;

  /** set verified as false if email been modified (or new) */
  if (user.isModified('email')) user.verified = false;

  /** hash password if it has been modified (or new) */
  if (user.isModified('password')) {
    /** salt and hash the user's password then set as user's password*/
    let hash = user.hashPassword(user.password);
    return hash.then(hashedPassword => {
      user.password = hashedPassword;
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
  if (++user.loginAttempts === MAX_LOGIN_ATTEMPTS) {
    user.lockedUntil   = Date.now() + LOCK_TIME;
    user.loginAttempts = 0;
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
function bcryptHash (password) {
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
function comaprePassword (password, hash) {
  return bcrypt.compare(password, hash);
}

UserSchema.methods.createLog = createLog;
UserSchema.methods.getLastLoginDate = getLastLoginDate;
UserSchema.methods.incLoginAttempts = incLoginAttempts;
UserSchema.methods.hashPassword  = bcryptHash;
UserSchema.methods.validatePassword = comaprePassword;

UserSchema.plugin(uniqueValidator);
export const UserModel = mongoose.model('User', UserSchema);
