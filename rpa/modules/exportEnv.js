/* Export environment variables
============================================================================= */

import fs   from 'fs';
import path from 'path';

/*
 * Parses a string into an object
 * @param {(string)} src - source to be parsed
 * @returns {Object} keys and values from src
 */
function parse (src) {
  const obj = {};
  // splitting into lines before processing
  src.split('\n').forEach( (line) => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    // check if a match found
    if (keyValueArr != null) {
      const key = keyValueArr[1];
      // default undefined or missing values to empty string
      let value = keyValueArr[2] || '';
      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim();
      obj[key] = value;
    }
  });
  return obj
}

/** set environment variables by an IIFE using .env.sh as the source */
(function setEnvironmentVariables () {
  let dotenvPath = path.resolve(process.cwd(), '.env.sh')
  let encoding = 'utf8'
  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }))
    // add each key/value pair found to `process.env` if not found.
    Object.keys(parsed).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) process.env[key] = parsed[key]
    });
  }
  catch (e) {
    console.error(`Unable to set environment variables: ${e}`);
    return process.exit(1);
  }
})();
