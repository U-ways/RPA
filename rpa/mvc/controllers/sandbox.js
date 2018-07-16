/* Sandbox route
 ============================================================================ */

import express from 'express';
import Store from '../../mvc/models/Store.js';

const router = express.Router();

router.get('/', function(req, res, next) {

  let invalid_store = new Store({
    name: "...................................................."
          + "..................................................",
    address: {
      street: "",
      county: "",
      postcode: "ABC 3DFG",
      country: ""
    }
  });

  Store.collection.drop((err) => {
    if (err)
      console.log("Collection doesn't exist: " + err.message);
    else
      console.log("Store collection dropped.\n");
    }
  );

  invalid_store.validate()
  .then(store => console.log("All good"))
  .catch(e    => {
    console.log( e.name );
    console.log( e.message );
  });

});

export default router;
