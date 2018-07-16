/* Log test
 ============================================================================ */
import { expect } from 'chai';
import Log from '../../mvc/models/Log.js';

export function valid() {
  let valid_doc = new Log({
    activity: 'Read',
    description: 'path/to/resoruce'
  })
  return valid_doc.validate()
  .catch(
    e => {
      console.log(e.errors);
      expect(e.errors).to.not.exist;
    }
  );
}

export function invalid() {
  let invalid_doc = new Log({
    activity: 'Read',
    date: '12/15/18',
    description: 123
  })
  return invalid_doc.validate()
  .catch( e => expect(e.errors).to.exist );
}

export function invalidActivity() {
  let invalid_doc = new Log({
    activity: 'Change',
  })
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['activity'].message;
      expect(message).to.match(/not a valid enum/);
    }
  );
}

export function defaultDate() {
  let valid_doc = new Log({
    activity: 'Login',
  })
  return valid_doc.validate()
  .catch(
    e => {
      console.log(e.errors);
      expect(e.errors).to.not.exist;
    }
  );
}
