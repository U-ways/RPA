import dotenv from 'dotenv/config';
import { Recaptcha } from 'express-recaptcha';

const ENV = process.env;

/**
 * Google reCaptcha v2 middleware.
 *
 * Docs: https://developers.google.com/recaptcha/intro
 *
 * @type {Recaptcha}
 */
export const reCaptcha = new Recaptcha(ENV.SITE_KEY, ENV.SECRET_KEY, {
  type: 'image',
  size: 'compact',
});
