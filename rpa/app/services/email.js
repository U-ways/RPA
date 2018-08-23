/* email service
  - SO: How to rotate sendGrid API key using the client only?
============================================================================= */

import { cl }      from '../../lib/colorLogger.js';
import { CronJob } from 'cron';

import sgClient from '@sendgrid/client';
import sgMail   from '@sendgrid/mail';

const ENV = process.env;

sgClient.setApiKey(ENV.SG_ADMIN_KEY);

/* Email services
============================================================================= */

/**
 * TODO:
 * - Allow templating with mustache.
 * - Allow UTF-8 subjects
 *
 * - https://sendgrid.api-docs.io/v3.0/mail-send
 *
 * @param  {[type]} email [description]
 */
function sendService (email) {
  sgMail.send(email);
}

/* API key initialisation
============================================================================= */

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
 * Initialise SendGrid email service by:
 *
 * - creating a limited API key that expires every month
 * - creating an in-process cron job to automatically rotate keys
 */
async function initialiseSG () {
  /** clean old RPA keys before creating a new one */
  await cleanRpakeys();

  /** create a new API key with current timestamp */
  const currentTimestamp = new Date().getTime();
  const newAPIKey = await createKey(currentTimestamp.toString());

  /** set the mail client a rotatable api key */
  sgMail.setApiKey(newAPIKey);

  /** rotate key every 2 months on first Monday at 9am */
  const job_rotateKey = new CronJob('0 9 1-7 */2 1', () => {
    rotateKey(sgMail.apiKey);
  });

  /** check SG mail service functionality */
  if (await testSGMailService()) job_rotateKey.start();
  else                           process.exit();
}

/**
 * Test the SG API by sending an email to a dummy account.
 *
 * @return {Boolean}  true if test passed, false otherwise.
 */
function testSGMailService () {
  const msg = {
    from: 'RPA-Bot <ue95.bot@gmail.com>',
    to: 'Void <test@email.com>',
    subject: 'test', text: 'test',
  };

  return sgMail.send(msg)
    .then(() => {
      cl.ok('[email] service test: passed')
      return true;
    })
    .catch(err => {
      cl.err(`[email] service test: failed; ${err.toString()} - reason:`);
      process.exitCode = 1;
      return false;
    });
}

/**
 * Delete old SG rotatable API keys that weren't deleted automatically
 * due to a crash or reboot.
 *
 * **rotatable API keys**: keys that are unix-timestamped with the following
 * format: `rpa-[unix_timestamp]`. (i.e. `rpa-1535029259145`)
 */
async function cleanRpakeys () {
  let keys = await getKeys();

  let rpaRotationKeys = keys.filter( ({name}) => {
    let regex = /rpa-[\d]+/;
    return regex.test(name);
  });

  rpaRotationKeys.forEach(({name, api_key_id}) => {
    cl.warn(`[email] deleting old API key: ${name}`);
    deleteKey(api_key_id);
  });
}


/* key rotation
============================================================================= */

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
  const KeyCreationDate  = await getCreationDate(key);

  /** rotate key if it is older than 1 month */
  if ((currentTimestamp - KeyCreationDate) > TWO_MONTHS) {
    cl.warn('[email] SendGrid API key expired, rotating key...');

    const newAPIKey = await createKey(currentTimestamp.toString());
    /** update client's API key */
    sgMail.setApiKey(newAPIKey);

    /** delete client's old api key */
    await deleteKey(key);
  }
}

/* Basic key operations
============================================================================= */

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
 * Get the API key creation date.
 *
 * @param  {String} key  the key to find its creation date
 * @return {Date}        key creation date
 */
function getCreationDate (key) {
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
      cl.err(`[email] Unable to get key creation date: ${err.code} ${err.message}`);
    });
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
      cl.err(`[email] Unable to get keys: ${err.code} ${err.message}`);
    });
}

/**
 * Create a new SG API key specifically for RPA.
 * The new key will have `rpa-[CREATION_DATE]` as it's name.
 *
 * NOTE:
 * The full API key returned can only be read once.
 * See [SG API keys doc][1] for details.
 *
 * [1]: https://sendgrid.com/docs/API_Reference/Web_API_v3/API_Keys/index.html
 *
 * @param  {String} name the name of the API key to be created.
 * @return {String}      full API key
 */
function createKey (name) {
  cl.act(`[email] creating a new API key: rpa-${name}`);
  let req = {
    method: 'POST',
    url: '/v3/api_keys',
    body: {
      name: `rpa-${name}`,
      scope: API_KEY_SCOPE,
    }
  };
  return sgClient.request(req)
    .then( ([res, body]) => {
      cl.ok(`[email] new API key created (ID: ${body.api_key_id})`);
      return body.api_key;
    })
    .catch( err => {
      cl.err(`[email] Unable to create new API key: ${err.code} ${err.message}`);
    });
}

/**
 * Delete an API key.
 *
 * NOTE:
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
    .then( ()   => cl.warn(`[email] removed old API key (ID: ${id})`))
    .catch( err => {
      cl.err(`[email] Unable to delete API key: ${err.code} ${err.message}`);
    });
}

/** export email methods as an object for convenience */

export const email = {
  init: initialiseSG,
  send: sendService,
}
