/* Log Mongoose schema
============================================================================= */
import mongoose from 'mongoose';

export const LogSchema = new mongoose.Schema({
  /**
  * The activity object is a number enum represneted as follow:
  *  0 = 'Login',  1 = 'Logout',
  *  2 = 'Create', 3 = 'Read',
  *  4 = 'Update', 5 = 'Delete'
  * @type {Number}
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
