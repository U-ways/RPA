/* Store Mongoose schema
============================================================================ */
// Mongoose instance is a Singleton (goo.gl/Nw3TqU)
import mongoose          from 'mongoose';
import uniqueValidator   from 'mongoose-unique-validator';
import { ProductSchema } from './Product.js';

// UK postcode format: https://www.mrs.org.uk/pdf/postcodeformat.pdf
const postcode_regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;

const StoreSchema = new mongoose.Schema({
  name: {
    index: true,
    type: String,
    unique: [true, 'already exists'],
    uniqueCaseInsensitive: true,
    required: [true, 'required'],
    maxlength: [100, 'max length (100) exceeded']
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
export default mongoose.model('Store', StoreSchema);
