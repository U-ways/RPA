/* Google reCaptcha middleware
============================================================================= */

import { Recaptcha } from 'express-recaptcha';

const env = process.env;

/**
 * Create a new reCaptcha object.
 * Docs: https://developers.google.com/recaptcha/intro
 *
 * @type {Recaptcha}
 */
export const reCaptcha = new Recaptcha(env.SITE_KEY, env.SECRET_KEY, {
  type: 'image',
  size: 'compact',
});
