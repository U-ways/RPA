/** Resolvers
============================================================================= */
import Store from '../../mvc/models/Store.js';

export function read(obj, {name}) {
  let regex  = new RegExp(name,'i');
  let query  = Store.findOne({ name: regex }).exec();
  let result = query.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function readAll(obj, {limit}) {
  let query  = Store.find().limit(limit).exec();
  let result = query.then((arr, err) => {
    if (err) console.log('err: ' + err);
    else     return arr;
  });
  return result;
}

export function create(obj, {name, address}) {
  let mutation = Store.create({
    name: name,
    address: {
      street:   address.street,
      county:   address.county,
      postcode: address.postcode,
      country:  address.country
    }
  })
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function remove(obj, {name}) {
  let regex    = new RegExp(name,'i');
  let mutation = Store.findOneAndDelete({ name: regex }).exec();
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function update(obj, {name, update}) {
  let regex    = new RegExp(name,'i');
  let query    = { name: regex };
  let options  = { new: true };
  let mutation = Store.findOneAndUpdate(query, update, options).exec();
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}
