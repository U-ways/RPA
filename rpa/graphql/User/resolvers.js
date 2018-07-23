/** Resolvers
  - FIXME: Learn how to handle and reutnr errors correctly with HTTP and status stuff
============================================================================= */
import User from '../../mvc/models/User.js';

export function read(obj, {username, email}) {
  if (!username && !email) console.log('err: please input username or email');
  let conditions = !!username ? {username: username} : {email: email};
  let query  = User.findOne(conditions).exec();
  let result = query.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function readAll(obj, {limit}) {
  let query  = User.find().limit(limit).exec();
  let result = query.then((arr, err) => {
    if (err) console.log('err: ' + err);
    else     return arr;
  });
  return result;
}

export function create(obj, {username, password, email}) {
  let mutation = User.create({
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
  let mutation = User.findOneAndDelete(conditions).exec();
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
  let mutation = User.findOneAndUpdate(conditions, update, options).exec();
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}
