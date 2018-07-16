/* Log Mongoose schema
 ============================================================================ */
import mongoose from 'mongoose';

export const LogSchema = new mongoose.Schema({
  activity: {
    type: String,
    required: [true, 'required.'],
    enum: ['Login', 'Logout', 'Create', 'Read', 'Update', 'Delete']
  },
  date: {
    type: Date,
    required: [true, 'required.'],
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [100, 'max length (100) exceeded']
  }
});

export default mongoose.model('Log', LogSchema);
