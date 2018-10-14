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
    get(n) {
      switch(n) {
        case 0: return "LOGIN";  break;
        case 1: return "LOGOUT"; break;
        case 2: return "CREATE"; break;
        case 3: return "READ";   break;
        case 4: return "UPDATE"; break;
        case 5: return "DELETE"; break;
      }
    }
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
