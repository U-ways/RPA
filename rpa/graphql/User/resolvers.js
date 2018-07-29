/** Resolvers
============================================================================= */
import { UserModel } from '../../mvc/models/User.js';

export function find(obj, {username, email}) {
  if (!username && !email) console.log('err: please input username or email');
  let conditions = !!username ? {username: username} : {email: email};
  let query  = UserModel.findOne(conditions).exec();
  let result = query.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function findAll(obj, {limit}) {
  let query  = UserModel.find().limit(limit).exec();
  let result = query.then((arr, err) => {
    if (err) console.log('err: ' + err);
    else     return arr;
  });
  return result;
}

export function create(obj, {username, password, email}) {
  let mutation = UserModel.create({
    username: username,
    password: password,
    email:    email
  })
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function remove(obj, {username, email}) {
  if (!username && !email) console.log('err: please input username or email');
  let conditions = !!username ? {username: username} : {email: email};
  let mutation = UserModel.findOneAndDelete(conditions).exec();
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function update(obj, {username, email, update}) {
  if (!username && !email) console.log('err: please input username or email');
  let conditions = !!username ? {username: username} : {email: email};
  let options  = { new: true };
  let mutation = UserModel.findOneAndUpdate(conditions, update, options).exec();
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}
