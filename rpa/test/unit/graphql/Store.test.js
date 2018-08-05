/* Store test
============================================================================= */
import mongoose from 'mongoose';
import { expect } from 'chai';
import { StoreData  } from '../../data/data.js';
import { StoreType  } from '../../../app/graphql/Store/types';
import { StoreModel } from '../../../app/mvc/models/Store.js';
import { QueryRootType, MutationRootType } from '../../../app/graphql';

/* Prepare
============================================================================= */

/** Create stores collection with sample documents to preform tests on **/

export function addFakeData() {
  // Convert stores objects to an array of stores without key mapping.
  let docs = Object.entries(StoreData).map(value => value[1]);

  return StoreModel.insertMany(docs)
  .catch(error =>
    expect(error, `${error}`).to.not.exist
  );
}

/** Drops database to reset environment for next tests **/

export function cleanDatabase() {
  return mongoose.connection.db.dropDatabase()
  .catch(error =>
    expect(error, `${error}`).to.not.exist
  );
}

/* Types
============================================================================= */

/** Test for valid field types **/

export function types() {
  let store = StoreType.getFields();
  for (let field in store) {
    let type = store[field].type;
    switch (field) {
      case 'name':
        expect(type, 'name').to.match(/^String!$/);
      break;
      case 'address':
        expect(type, 'address').to.match(/^AddressType!$/);
      break;
      case 'products':
        expect(type, 'products').to.match(/\[ProductType\]$/);
      break;
    }
  }
}

/* Queries
============================================================================= */

const query = QueryRootType.getFields();

/** Should return the found documents **/

export function find() {
  let condition = { name: StoreData.morrisons.name };
  let find = query.findStore.resolve({}, condition);

  return find.then(
    result => {
      expect(result.name).to.equal(StoreData.morrisons.name);
      expect(result.address).to.deep.include(StoreData.morrisons.address);
    }
  )
}

/** Should return an array of found documents **/

export function findAll() {
  let find = query.findAllStores.resolve({}, 3);

  return find.then(
    result => {
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.an.instanceof(Object);
    }
  )
}

/* Mutations
============================================================================= */

const mutation = MutationRootType.getFields();

/** Should return the created document **/

export function create() {
  let doc = {
    name: "New Store LTD",
    address: {
      street: 'City of Westminster, London',
      county: 'Middlesex',
      postcode: 'W1S 1DW',
      country: 'United Kingdom'
    }
  }
  let create = mutation.createStore.resolve({}, doc);

  return create.then(
    result => {
      expect(result.name).to.equal(doc.name);
      expect(result.address).to.deep.include(doc.address);
    }
  )
}

/** Should return the updated document **/

export function update() {
  let changes = {
    name: StoreData.asda.name,
    update: {
      name: "Updated",
      address: {
        street: "Updated"
      }
    }
  };
  let update  = mutation.updateStore.resolve({}, changes);

  return update.then(
    result => {
      expect(result).to.not.be.null;
      expect(result.name).to.equal(changes.update.name);
      expect(result.address).to.deep.include(changes.update.address);
    }
  )
}

/** Should return the deleted document **/

export function remove() {
  let name   = StoreData.tesco.name;
  let remove = mutation.removeStore.resolve({}, {name: name});

  return remove.then(
    result => {
      expect(result).to.not.be.null;
      expect(result.name).to.include(name);
      expect(result).to.have.property('address');
    }
  )
}
