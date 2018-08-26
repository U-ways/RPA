/** Resolvers
============================================================================= */

import { UserModel } from '../../mvc/models/User.js';

export function find(obj, {username, email}) {
  let conditions = !!username ? {username: username} : {email: email};
  let query  = UserModel.findOne(conditions).exec();
  let result = query.then(doc => {
    return doc;
  });
  return result;
}

export function findAll(obj, {limit}) {
  let query  = UserModel.find().limit(limit).exec();
  let result = query.then(arr => {
    return arr;
  });
  return result;
}

export function create(obj, {username, password, email}) {
  let mutation = UserModel.create({
    username: username,
    password: password,
    email:    email
  })
  let result   = mutation.then(doc => {
    return doc;
  });
  return result;
}

export function remove(obj, {username, email}) {
  let conditions = !!username ? {username: username} : {email: email};
  let mutation = UserModel.findOneAndDelete(conditions).exec();
  let result   = mutation.then(doc => {
    return doc;
  });
  return result;
}

export function update(obj, {username, email, update}) {
  let conditions = !!username ? {username: username} : {email: email};
  let options  = { new: true };
  let mutation = UserModel.findOneAndUpdate(conditions, update, options).exec();
  let result   = mutation.then(doc => {
    return doc;
  });
  return result;
}
