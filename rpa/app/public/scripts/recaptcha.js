/* Dynamically bind recaptcha challenge to parent form element
- @see recaptcha middleware for more details
============================================================================= */

/** select form using recaptcha parentElement */
let form = document.querySelector('#recaptcha').parentElement;

/**
 * Programmatically bind the challenge to the form and prevent form submission
 * before recaptcha challenge is executed.
 *
 * https://developers.google.com/recaptcha/docs/invisible#explicit_render
 */
function recaptchaForm (event) {
  event.preventDefault();
  grecaptcha.execute();
}

/**
 * Submit form after recaptcha executes using the callback attribute.
 *
 * https://developers.google.com/recaptcha/docs/invisible#render_param
 *
 * @param {String} token recaptcha response token
 */
function onSubmit (token) {
  form.submit();
}

form.addEventListener("submit", recaptchaForm);
