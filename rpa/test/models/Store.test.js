/* Store test
 ============================================================================ */
import { expect } from 'chai';
import Store from '../../mvc/models/Store.js';

let tesco = new Store({
  name: 'TEST-DOC: TESCO STORES LIMITED',
  address: {
    street: 'Tesco House, Shire Park, Kestrel Way',
    county: 'Welwyn Garden City',
    postcode: 'AL7 1GA',
    country: 'United Kingdom'
  }
});

export function valid() {
  let valid_doc  = new Store({
    name: 'TEST-DOC: ASDA STORES LIMITED',
    address: {
      street: 'Asda House, South Bank, Great Wilson Street',
      county: 'Leeds',
      postcode: 'LS11 5AD',
      country: 'United Kingdom'
    }
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
  let invalid_doc = new Store({
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

export function invalidPostcode() {
  let invalid_doc = new Store({
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
