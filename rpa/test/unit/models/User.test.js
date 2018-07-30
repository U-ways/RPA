/* User test
============================================================================= */
import { expect } from 'chai';
import { UserModel } from '../../../mvc/models/User.js';
import { UserData  } from '../../data/data.js';

/** Pass a valid document and validate **/

export function valid() {
  let valid_doc = new UserModel(UserData.uways);
  return valid_doc.validate()
  .catch(
    e => {
      expect(e.errors, `${e.errors}`).to.not.exist;
    }
  );
}

/** Pass an invalid document and validate **/

export function invalid() {
  let invalid_doc = new UserModel({
    username: '_u-ways',
    password: '',
    email: '@u_ways@email'
  });
  return invalid_doc.validate()
  .catch( e => expect(e.errors).to.exist );
}

/** Pass an invalid username to a document and validate **/

export function invalidUsername() {
  let invalid_doc = new UserModel({
    username: '_u-ways'
  });
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['username'].message;
      expect(message).to.equal('invalid format');
    }
  );
}

/** Pass an invalid password to a document and validate **/

export function invalidPassword() {
  let invalid_doc = new UserModel({
    password: ''
  });
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['password'].message;
      expect(message).to.equal('required');
    }
  );
}

/** Pass an invalid email to a document and validate **/

export function invalidEmail() {
  let invalid_doc = new UserModel({
    email: '@u_ways@email'
  });
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['email'].message;
      expect(message).to.equal('invalid format');
    }
  );
}
