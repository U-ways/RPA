/* Store test
============================================================================= */
import mongoose from 'mongoose';
import { expect }    from 'chai';
import { StoreType } from '../../graphql/Store/types';
import { QueryRootType, MutationRootType } from '../../graphql';

/* Prepare
============================================================================= */

export function addFakeData() {
  const connection = mongoose.connection;

  connection.on('connected', () => {
    // add fake data
  });

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



/* Mutations
============================================================================= */

const mutation = MutationRootType.getFields();

/** Should return the created document **/

export function create() {
  let doc = {
    name: "Demo Stores LTD",
    address: {
      street: "Demo street" ,
      county: "Demo country",
      postcode: "DM0 0UE",
      country: "Demo World"
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

/** TODO Should return the updated document **/

export function update() {
  let changes = {
    name: "Demo Stores LTD",
    update: {
      name: "Updated Stores LTD",
      address: {
        street: "Updated street"
      }
    }
  };
  let update  = mutation.updateStore.resolve({}, changes);

  return update.then(
    result => {
      expect(result.name).to.equal(changes.update.name);
      expect(result.address).to.deep.include(changes.update.address);
    }
  )
}

/** TODO Should return the deleted document **/

export function remove() {
  let name = { name: "Updated Stores LTD" }
  let remove = mutation.removeStore.resolve({}, name);

  return remove.then(
    result => {
      // console.log(result);
      expect(result.name).to.include(name.name);
      // expect(result.address).to.deep.include(doc.address);
    }
  )
}
