/* Store Mongoose schema
============================================================================= */

// Mongoose instance is a Singleton (goo.gl/Nw3TqU)
import mongoose          from 'mongoose';
import uniqueValidator   from 'mongoose-unique-validator';

import { ProductSchema } from './Product.js';

/**
 * Regex to follow some [UK compnay naming standards][1]
 *
 * This based on an answer I posted on SO:
 * [Regex - match a valid company name (UK regulations)][2]
 *
 * **NOTE:**
 * This is built for fun, I would not recommend such solution on production.
 *
 * [1]: http://www.legislation.gov.uk/uksi/2015/17/regulation/2/made
 * [2]: https://stackoverflow.com/a/52265094/5037430
 */
const UKCompnay_regex = /^(?=(?=([^{}()<>]*\[+[^{}()<>]*\]+[^{}()<>]*))\1*$|(?=([^[\]()<>]*\{+[^[\]()<>]*\}+[^[\]()<>]*))\2*$|(?=([^[\]{}<>]*\(+[^[\]{}<>]*\)+[^[\]{}<>]*))\3*$|(?=([^[\]{}()]*\<+[^[\]{}()]*\>+[^[\]{}()]*))\4*$|(?=([^[\]{}()<>]*))\5*$)(?=(?=([^"]*\“+[^"]*\”+[^"]*))\6*$|(?=([^“”]*\"+[^“”]*\"+[^“”]*))\7*$|(?=([^"“”]*))\8*$)(?=(?=([^']*‘+[^']*’+[^']*))\9*$|(?=([^‘’]*'+[^‘’]*'+[^‘’]*))\10*$|(?=([^'‘’]*))\11*$)[A-Za-z0-9 \"“”'‘’()[\]{}<>«»\\\/?!&@£$€¥.,-]{3}[A-Za-z0-9 \"“”'‘’()[\]{}<>«»\\\/?!&@£$€¥.,\-*=#%+]{0,157}$/;

/**
 * [UK postcode format standards][1]
 * [1]: https://www.mrs.org.uk/pdf/postcodeformat.pdf
 */
const postcode_regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;

const StoreSchema = new mongoose.Schema({
  name: {
    index: true,
    type: String,
    match: [UKCompnay_regex, 'invalid format'],
    unique: [true, 'already exists'],
    uniqueCaseInsensitive: true,
    required: [true, 'required'],
    maxlength: [160, 'max length (160) exceeded']
  },
  address: {
    street: {
      type: String,
      required: [true, 'required'],
      maxlength: [100, 'max length (100) exceeded']
    },
    county: {
      type: String,
      maxlength: [50, 'max length (50) exceeded']
    },
    postcode: {
      type: String,
      match: [postcode_regex, 'invalid format'],
      required: [true, 'required'],
      maxlength: [10, 'max length (10) exceeded']
    },
    country: {
      type: String,
      required: [true, 'required'],
      maxlength: [50, 'max length (50) exceeded']
    }
  },
  products: [ProductSchema]
});

StoreSchema.plugin(uniqueValidator);
export const StoreModel = mongoose.model('Store', StoreSchema);
