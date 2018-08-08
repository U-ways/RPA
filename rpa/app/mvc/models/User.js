/* User Mongoose schema
============================================================================= */
import dotenv   from 'dotenv/config';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { LogSchema }   from './Log.js';

/** Must starts with a letter then can include underscores (_) & hyphens (-) **/
const username_regex = /^[a-zA-Z][\w-]+$/;
/** W3C Email regex: goo.gl/NQgCtK (Based on RFC5322) **/
const email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    uniqueCaseInsensitive: true,
    unique: [true, 'already exists'],
    required: [true, 'required'],
    match: [username_regex, 'invalid format'],
    maxlength: [30, 'max length (40) exceeded']
  },
  email: {
    type: String,
    required: [true, 'required'],
    match: [email_regex, 'invalid format'],
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
    max: [5, 'user allowed 5 login attempts max'],
    default: 0,
  },
  lockedUntil: {
    type: Date,
  },
  logs: [LogSchema]
});

/* User pre-save
============================================================================= */

UserSchema.pre('save', function (next) {
  let user = this;

  /** only hash password if it has been modified (or new) */
  if (!user.isModified('password')) return next();

  /** salt and hash the user's password*/
  let hash = user.hashPassword(user.password);

  /** set the hashed password as the user's password */
  hash.then(hashedPassword => {
    user.password = hashedPassword;
    return next();
  });

});

/* User instance methods
============================================================================= */
import bcrypt from 'bcrypt';

/**
 * A middleware to automatically hash the password
 * before it's saved to the database.
 *
 * @param  {String}  password  clear password
 * @return {String}            hashed password
 */

function bcryptHash(password) {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares both input and actual password togther
 *
 * @param  {String}  password  user input
 * @return {boolean}           true if password match, false otherwise.
 *                             also returns false if errors found.
 */

function comaprePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

UserSchema.methods.hashPassword  = bcryptHash;
UserSchema.methods.validPassword = comaprePassword;

UserSchema.plugin(uniqueValidator);
export const UserModel = mongoose.model('User', UserSchema);
