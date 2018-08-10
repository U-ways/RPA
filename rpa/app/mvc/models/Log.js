/* Log Mongoose schema
============================================================================= */
import mongoose from 'mongoose';

export const LogSchema = new mongoose.Schema({
  /**
  * The activity property is a number enum represneted as follow:
  * LOGIN:  0, LOGOUT: 1,
  * CREATE: 2, READ:   3,
  * UPDATE: 4, DELETE: 5,
  */
  activity: {
    type: Number,
    min: 0, max: 5,
    required: [true, 'required.'],
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [100, 'max length (100) exceeded']
  }
});

export default mongoose.model('Log', LogSchema);
