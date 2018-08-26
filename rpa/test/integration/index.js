/* Demo
  - Initialize data for demo
============================================================================= */
import mongoose from 'mongoose';
import data     from './data.js';
import { cl }   from '../modules/colorLogger.js';

const connection = mongoose.connection;

connection.on('connected', () => {
  console.warn(`[app] Demo is turned on - initializing:`);

  for (let col in data) {

    connection.dropCollection(col,
      err => {
        if (err) console.error(`${col} doesn't exist: ${err.message}`,);
        else     cl.act(`Delete collection (${col})`);
      }
    );

    for (let doc in data[col]) {
      data[col][doc].save(
        err => {
          if (err) console.error(`Unable to save: ${err.message}`);
          else     cl.act(`Create document in ${col} (${doc})`);
        }
      );
    }

  }

});
