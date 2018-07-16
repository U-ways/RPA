/* Product test
 ============================================================================ */
import { expect } from 'chai';
import Product from '../../mvc/models/Product.js';

export function valid() {
  let valid_doc = new Product({
  name: 'Beck\'s',
  priceTimeline: [
    {
      price: 1.75,
      date: 1531590281248
    },
    {
      price: 2.00,
      date: 1531500281248
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
    priceTimeline: [
      {
        price: -1,
        date: "",
      }
    ]
  });
  return invalid_doc.validate()
  .catch( e => expect(e.errors).to.exist );
}

export function defaultDate() {
  let valid_doc = new Product({
    name: "Weissbier",
    priceTimeline: [
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
    expect(valid_doc.priceTimeline[0].date).to.exist
  );
}
