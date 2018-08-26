/* key operations
============================================================================= */

import sgClient from '@sendgrid/client';

const env = process.env;

sgClient.setApiKey(env.SG_ADMIN_KEY);

/**
 * Everything in the API key _after the SG and before the second dot_ is the
 * key ID, Example:
 *
 * IF   `KEY = SG.aaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbb`
 * THEN `ID  = aaaaaaaaaaaaaa`
 *
 * So I am using a **positive lookbehind** and **positive lookahead**
 * regex to get the ID in between SG and the second dot.
 */
const ID_FROM_KEY_REGEX = /(?<=SG\.).*?(?=\.)/;

/**
 * API Key scope to limit endpoint access for generated keys in production.
 * See [key permissions list][1] for further details.
 *
 * [1]: https://sendgrid.com/docs/API_Reference/Web_API_v3/API_Keys/api_key_permissions_list.html
 */
const API_KEY_SCOPE = [
  'mail.send',
  'messages.read',
  'email_activity.read',
];

/**
 * Rotate the API key by creating a new key and discarding the old key
 * only if the old key is older than one month.
 *
 * The new key will have a UNIX timestamp as its name.
 *
 * @param  {String} key SG API key
 */
async function rotateKey (key) {
  const TWO_MONTHS = 5200000000; // ~2 month time in UNIX timestamp.
  const currentTimestamp = new Date().getTime();
  let   KeyCreationDate  = await getKeyDate(key);

  /** rotate key if it is older than 1 month */
  if ((currentTimestamp - KeyCreationDate) > TWO_MONTHS) {
    console.warn('[email] SendGrid API key expired, rotating key...');

    /** create new key using current timestamp */
    let newAPIKey = await createKey(currentTimestamp.toString());

    /** delete client's old api key */
    await deleteKey(key);

    return newAPIKey;
  }
}

/**
 * Return all SG API keys.
 *
 * @return {Array}  array of API keys
 */
function getKeys () {
  const req = {
    method: 'GET',
    url: `/v3/api_keys`,
  };
  return sgClient.request(req)
    .then( ([res, {result}]) => {
      return result;
    })
    .catch( err => {
      console.error(`[email] Unable to get keys: ${err.code} ${err.message}`);
    });
}

/**
 * Create a new SG API key specifically for RPA.
 * The new key will have `rpa-[CREATION_DATE]` as it's name.
 *
 * Note:
 * The full API key returned can only be read once.
 * See [SG API keys doc][1] for details.
 *
 * [1]: https://sendgrid.com/docs/API_Reference/Web_API_v3/API_Keys/index.html
 *
 * @param  {String} name the name of the API key to be created.
 * @return {String}      full API key
 */
function createKey (name) {
  const req = {
    method: 'POST',
    url: '/v3/api_keys',
    body: {
      name: `rpa-${name}`,
      scope: API_KEY_SCOPE,
    }
  };
  return sgClient.request(req)
    .then( ([res, body]) => {
      console.info(`[email] created new API key (ID: ${body.api_key_id})`);
      return body.api_key;
    })
    .catch( err => {
      console.error(`[email] Unable to create new API key: ${err.code} ${err.message}`);
    });
}

/**
 * Delete an API key.
 *
 * Note:
 * You can pass the API key or ID to identify the key to delete.
 *
 * @param  {String} key The API key or ID to delete
 */
function deleteKey (key) {
  /** allow full key and id input */
  const id  = (ID_FROM_KEY_REGEX.test(key))
    ? key.match(ID_FROM_KEY_REGEX)[0] : key;
  const req = {
    method: 'DELETE',
    url: `/v3/api_keys/${id}`,
  };
  return sgClient.request(req)
    .then( ()   => console.warn(`[email] removed old API key (ID: ${id})`))
    .catch( err => {
      console.error(`[email] Unable to delete API key: ${err.code} ${err.message}`);
    });
}

/**
 * Get the API key creation date.
 *
 * @param  {String} key  the key to find its creation date
 * @return {Date}        key creation date
 */
function getKeyDate (key) {
  const id = key.match(ID_FROM_KEY_REGEX)[0];
  const req = {
    method: 'GET',
    url: `/v3/api_keys/${id}`,
  };
  return sgClient.request(req)
    .then( ([res, key]) => {
      let timestamp = parseInt(key.name, 10);
      return new Date(timestamp);
    })
    .catch( err => {
      console.error(`[email] Unable to get key creation date: ${err.code} ${err.message}`);
    });
}

/**
 * Delete old SG rotatable API keys that weren't deleted automatically
 * due to a crash or reboot.
 *
 * **rotatable API keys**: keys that are unix-timestamped with the following
 * format: `rpa-[unix_timestamp]`. (i.e. `rpa-1535029259145`)
 */
export async function cleanKeysDatabase () {
  let keys = await getKeys();

  let rpaRotationKeys = keys.filter( ({name}) => {
    let regex = /rpa-[\d]+/;
    return regex.test(name);
  });

  rpaRotationKeys.forEach(({name, api_key_id}) => {
    console.warn(`[email] deleting old API key: ${name}`);
    deleteKey(api_key_id);
  });
}

/**
 * SG API key basic and complex operations.
 */
export const key = {
  create: createKey,
  delete: deleteKey,
  rotate: rotateKey,
  date:   getKeyDate,
};
