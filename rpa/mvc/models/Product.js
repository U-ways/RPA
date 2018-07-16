/* Product Mongoose schema
============================================================================= */
import mongoose from 'mongoose';

const TimelineSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: [true, 'required'],
      default: Date.now,
      get: d => d.toDateString()
    },
    price: {
      type: Number,
      required: [true, 'required'],
      min: [0, 'cannot be negative'],
      set: n => Math.round(n * 100) / 100,
      get: n => `£${n}`
    },
    sold: {
      type: Number,
      min: [0, 'cannot be negative'],
      default: 0
    }
});

export const ProductSchema = new mongoose.Schema({
  name: {
    index: true,
    type: String,
    maxlength: [80, 'max length (80) exceeded'],
    required: [true, 'required']
  },
  timeline: [TimelineSchema]
});

export default mongoose.model('Product', ProductSchema);
