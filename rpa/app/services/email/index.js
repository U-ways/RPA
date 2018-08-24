/* email service
  - SO: How to rotate sendGrid API key using the client only?
============================================================================= */

import { readFile } from 'fs';
import { cl }       from '../../../lib/colorLogger.js';
import { CronJob }  from 'cron';
import Mustache     from 'mustache';

import sgMail from '@sendgrid/mail';
import { key, cleanKeysDatabase } from './keyOperations.js';

const ENV = process.env;

/* Email services
============================================================================= */

/**
 * Send an email using SendGrid mail client.
 *
 * Refer to the [POST /mail/send][1] endpoint documentation
 * for Request Body Schema.
 *
 * For practical examples, refer to [USE_CASES.md][2] documentation.
 *
 * [1]: https://sendgrid.api-docs.io/v3.0/mail-send/v3-mail-send
 * [2]: https://github.com/sendgrid/sendgrid-nodejs/blob/master/packages/mail/USE_CASES.md
 *
 * @param  {JSON} content the email content
 */
async function sendEmail (data) {
  let email = {
    to:   `${data.to.name} <${data.to.email}>`,
    from: `${data.from.name} <${data.from.email}>`,
    subject: `${data.subject}`,
    text: await renderTemplate(data.text, data),
    html: await renderTemplate(data.html, data),
  };
  return sgMail.send(email);
}

/**
 * Render a template if available within the templates folder
 * using the view provided. (view engine: Mustache)
 *
 * @param  {String} file  The file to be rendered
 * @param  {Object} view  The view to render
 * @return {String|null}  String if file rendered successfully, null otherwise.
 */
function renderTemplate (file, view) {
  return new Promise((resolve, reject) => {
    readFile(__dirname + `/templates/${file}`, 'utf8', (err, template) => {
      if (err) return reject(err);
      let output = Mustache.render(template, view);
      return resolve(output);
    });
  });
}

/**
 * Initialise SendGrid email service by:
 * \- creating a limited API key that expires every month
 * \- creating an in-process cron job to automatically rotate keys
 */
async function initialiseSG () {
  /** clean old unrotated RPA keys before creating a new one */
  await cleanKeysDatabase();

  /** create a new API key with current timestamp */
  const currentTimestamp = new Date().getTime();
  let newAPIKey = await key.create(currentTimestamp.toString());

  /** set the mail client a rotatable api key */
  sgMail.setApiKey(newAPIKey);

  /** rotate key every 2 months on first Monday at 9am */
  const job_rotateKey = new CronJob('0 9 1-7 */2 1', async () => {
    let newAPIKey = await key.rotate(sgMail.apiKey);
    sgMail.setApiKey(newAPIKey);
  });

  job_rotateKey.start();
}

/**
 * Test the SG API by sending an email to a dummy account.
 *
 * See [Safely Test Your Sending Speed][1] for details about testing
 * without negatively impacting reputation.
 *
 *[1]: https://sendgrid.com/docs/ui/account-and-settings/safely-test-your-sending-speed/
 *
 * @return {Boolean}  true if test passed, false otherwise.
 */
async function testSGMailService () {
  const msg = {
    from: 'RPA-Bot <ue95.bot@gmail.com>',
    to: 'Void <test@sink.sendgrid.net>',
    subject: 'test', text: 'test',
    mail_settings: {
  		sandbox_mode: { enable: true }
  	},
  };

  sgMail.send(msg)
    .then(() => {
      cl.ok('[email] service test: passed');
      return true;
    })
    .catch(err => {
      cl.err(`[email] service test: failed - reason: ${err.toString()}`);
      return false;
    });
}

/**
 * email services.
 */
export const email = {
  init: initialiseSG,
  test: testSGMailService,
  send: sendEmail,
}
