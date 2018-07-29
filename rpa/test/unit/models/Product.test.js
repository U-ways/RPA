/* Product test
============================================================================= */
import { expect } from 'chai';
import Product from '../../../mvc/models/Product.js';

export function valid() {
  let valid_doc = new Product({
    name: 'Beck\'s',
    timeline: [
      {
        price: 1.75,
        date: 1531590281248,
        sold: 5
      },
      {
        price: 2.00,
        date: 1531500281248,
        sold: 2
      }
    ]
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
  let invalid_doc = new Product({
    name: "",
    timeline: [
      {
        price: -1,
        date: "",
        sold: -99
      }
    ]
  });
  return invalid_doc.validate()
  .catch( e => expect(e.errors).to.exist );
}

export function defaultDate() {
  let valid_doc = new Product({
    name: "Weissbier",
    timeline: [
      {
        price: 1.80,
      }
    ]
  });
  return valid_doc.validate()
  .catch(
    e => {
      console.log(e.errors);
      expect(e.errors).to.not.exist;
    }
  )
  .then(
    expect(valid_doc.timeline[0].date).to.exist
  );
}

export function negativeSold() {
  let invalid_doc = new Product({
    name: "Corona",
    timeline: [
      {
        price: 1.60,
        sold: -9
      }
    ]
  });
  return invalid_doc.validate()
  .catch(
    e => {
      let message = e.errors['timeline.0.sold'].message;
      expect(message).to.match(/negative/);
    }
  )
}
