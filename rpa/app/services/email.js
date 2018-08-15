/* email service

NOTE:
  So the problem is nodemailer as of current is
  incompatible with Google service accounts.

  Therefore, I am going to use Client ID instead.

  see https://stackoverflow.com/a/47936349/5037430 for more information.

NOTE:
  Also the fact that I don't have TLS support might be the issue.

============================================================================= */

import cl from '../../lib/colorLogger.js';
import nodemailer from 'nodemailer';

import { SMTP_CONFIG } from '../config/smtp.config.js';

const ENV = process.env;

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: SMTP_CONFIG.client_email,
    serviceClient: SMTP_CONFIG.client_id,
    privateKey: SMTP_CONFIG.private_key,
    accessUrl: SMTP_CONFIG.token_uri,
  },
});

/** A listener to log when a token is being created */
transport.on('token', token => console.log(token));

const mailOptions = {
  from: SMTP_CONFIG.client_email,
  to: 'ue95.mail@gmail.com',
  subject: 'RPA - test email',
  html: 'Pls do not reply.',
};

transport.sendMail( mailOptions,
  (error, info) => {
    if (error) console.log(cl.err, error);
    else       console.log(cl.ok, `Message sent: ${info.response}`);
  }
);
