/* Demo
  - Initialize data for demo
============================================================================= */
import mongoose from 'mongoose';
import data from './data.js';
import cl from '../modules/colorLogger.js';

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log(cl.warn, `[app] Demo is turned on - initializing:`);

  for (let col in data) {

    connection.dropCollection(col,
      err => {
        if (err) console.log(cl.err, `${col} doesn't exist: ${err.message}`,);
        else     console.log(cl.act, `Delete collection (${col})`);
      }
    );

    for (let doc in data[col]) {
      data[col][doc].save(
        err => {
          if (err) console.log(cl.err, `Unable to save: ${err.message}`);
          else     console.log(cl.act, `Create document in ${col} (${doc})`);
        }
      );
    }

  }

});
