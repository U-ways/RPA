import dotenv from 'dotenv/config';
import { Recaptcha } from 'express-recaptcha';

const ENV = process.env;

/**
 * Doc me within the middleware
 * @type {Recaptcha}
 */
export const recaptcha = new Recaptcha(ENV.SITE_KEY, ENV.SECRET_KEY, {
  type: 'image',
  size: 'compact',
});
