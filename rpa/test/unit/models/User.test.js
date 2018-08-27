/* User test
============================================================================= */
import { expect } from 'chai';
import { UserModel } from '../../../app/mvc/models/User.js';
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
    email: '@u_ways@email',
    'security.password': '',
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

export function invalidatePassword() {
  let invalid_doc = new UserModel({
    'security.password': ''
  });
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['security.password'].message;
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
