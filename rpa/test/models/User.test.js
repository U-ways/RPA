/* User test
============================================================================= */
import { expect } from 'chai';
import User from '../../mvc/models/User.js';

export function valid() {
  let valid_doc = new User({
    username: 'u-ways',
    password: 'sandbox@!"£@"#~',
    email: 'u_ways@email.com'
  });
  return valid_doc.validate()
  .catch(
    e => {
      console.log(e.errors);
      expect(e.errors).to.not.exist;
    }
  );
}

export function invalid() {
  let invalid_doc = new User({
    username: '_u-ways',
    password: '',
    email: '@u_ways@email'
  });
  return invalid_doc.validate()
  .catch( e => expect(e.errors).to.exist );
}

export function invalidUsername() {
  let invalid_doc = new User({
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

export function invalidPassword() {
  let invalid_doc = new User({
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

export function invalidEmail() {
  let invalid_doc = new User({
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
