/** Resolvers
============================================================================= */
import { StoreModel } from '../../mvc/models/Store.js';
import flatten    from 'flat';

export function find(obj, {name}) {
  let regex  = new RegExp(name,'i');
  let query  = StoreModel.findOne({ name: regex }).exec();
  let result = query.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}

export function findAll(obj, {limit}) {
  let query  = StoreModel.find().limit(limit).exec();
  let result = query.then((arr, err) => {
    if (err) console.log('err: ' + err);
    else     return arr;
  });
  return result;
}

export function create(obj, {name, address}) {
  let mutation = StoreModel.create({
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
  let mutation = StoreModel.findOneAndDelete({ name: regex }).exec();
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
  let mutation = StoreModel.findOneAndUpdate(query, flatten(update), options).exec();
  let result   = mutation.then((doc, err) => {
    if (err) console.log('err: ' + err);
    else     return doc;
  });
  return result;
}
