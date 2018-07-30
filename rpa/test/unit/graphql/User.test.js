/* Store test
============================================================================= */
import mongoose from 'mongoose';
import { expect } from 'chai';
import { UserData  } from '../../data/data.js';
import { UserType  } from '../../../graphql/User/types';
import { UserModel } from '../../../mvc/models/User.js';
import { QueryRootType, MutationRootType } from '../../../graphql';

/* Prepare
============================================================================= */

/** Create stores collection with sample documents to preform tests on **/

export function addFakeData() {
  // Convert User objects to an array of stores without key mapping.
  let docs = Object.entries(UserData).map(value => value[1]);
  // console.log(docs);
  return UserModel.insertMany(docs)
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
  let user = UserType.getFields();
  for (let field in user) {
    let type = user[field].type;
    switch (field) {
      case 'username':
        expect(type, 'name').to.match(/^String!$/);
      break;
      case 'email':
        expect(type, 'address').to.match(/^String!$/);
      break;
      case 'logs':
        expect(type, 'products').to.match(/\[LogType\]$/);
      break;
    }
  }
}

/* Queries
============================================================================= */

const query = QueryRootType.getFields();

/** Should return the found documents **/

export function find() {
  let condition = { username: UserData.uways.username };
  let find = query.findUser.resolve({}, condition);

  return find.then(
    result => {
      expect(result.username).to.equal(UserData.uways.username);
      expect(result).to.have.property('logs');
      expect(result.logs).to.be.an.instanceof(Array);
    }
  )
}

/** Should return an array of found documents **/

export function findAll() {
  let find = query.findAllUsers.resolve({}, 2);

  return find.then(
    result => {
      expect(result).to.have.lengthOf(2);
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
    username: 'New_User',
    password: '1234abcd',
    email: 'newUser@email.com'
  }
  let create = mutation.createUser.resolve({}, doc);

  return create.then(
    result => {
      expect(result.username).to.equal(doc.username);
      expect(result.email).to.equal(doc.email);
    }
  )
}

/** Should return the updated document **/

export function update() {
  let changes = {
    username: UserData.joe.username,
    update: {
      username: "Updated",
      email: 'Updated@email.com'
    }
  };
  let update  = mutation.updateUser.resolve({}, changes);

  return update.then(
    result => {
      expect(result).to.not.be.null;
      expect(result.username).to.equal(changes.update.username);
      expect(result.email).to.equal(changes.update.email);
    }
  )
}

/** Should return the deleted document **/

export function remove() {
  let username = UserData.uways.username;
  let remove   = mutation.removeUser.resolve({}, {username: username});

  return remove.then(
    result => {
      expect(result).to.not.be.null;
      expect(result.username).to.include(username);
      expect(result).to.have.property('email');
    }
  )
}
