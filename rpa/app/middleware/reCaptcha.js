/* Google reCaptcha middleware
============================================================================= */

import { Recaptcha } from 'express-recaptcha';

/**
 * Create a new reCaptcha object.
 * Docs: https://developers.google.com/recaptcha/intro
 *
 * @type {Recaptcha}
 */
export const reCaptcha = new Recaptcha(process.env.SITE_KEY, process.env.SECRET_KEY, {
  type: 'image',
  size: 'compact',
});
