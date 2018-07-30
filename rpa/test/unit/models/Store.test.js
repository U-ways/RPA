/* Store test
 ============================================================================ */
import { expect } from 'chai';
import { StoreModel } from '../../../mvc/models/Store.js';
import { StoreData  } from '../../data/data.js';

/** Pass a valid document and validate **/

export function valid() {
  let valid_doc  = new StoreModel(StoreData.asda);
  return valid_doc.validate()
  .catch(
    e => {
      expect(e.errors, `${e.errors}`).to.not.exist;
    }
  );
}

/** Pass an invalid document and validate **/

export function invalid() {
  let invalid_doc = new StoreModel({
    name: '....................................................'
    + '..................................................',
    address: {
      street: '',
      county: '',
      postcode: '',
      country: ''
    }
  });
  return invalid_doc.validate()
  .catch( e => expect(e.errors).to.exist );
}

/** Pass an invalid postcode to a document and validate **/

export function invalidPostcode() {
  let invalid_doc = new StoreModel({
    address: {
      postcode: 'ABC 555',
    }
  });
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['address.postcode'].message;
      expect(message).to.equal('invalid format');
    }
  );
}
