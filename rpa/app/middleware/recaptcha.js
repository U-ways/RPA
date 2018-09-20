/* recaptcha middleware
============================================================================= */

/**
 * Create a new recaptcha object.
 * Docs: https://developers.google.com/recaptcha/docs/invisible
 *
 * The `scripts/recaptcha.js` script dynamically binds a recaptcha challenge
 * to a parent form element. The script can be found in the `public` resources
 * directory.
 */
export const recaptcha = {
  invisible: {
    render(req, res, next) {
      let key    = process.env.RECAP_INVIS_SITE_KEY;
      let script = `<script src="https://www.google.com/recaptcha/api.js" async defer></script>\n`
                 + `<script src="scripts/recaptcha.js" async defer></script>\n`;
      let div    = `<div id='recaptcha' class="g-recaptcha" data-callback="onSubmit" `
                 + `data-sitekey="${key}" data-size="invisible"></div>`;
      res.locals.recaptcha = script + div;

      return next();
    },
    verify(req, res, next) {
      let key = process.env.RECAP_INVIS_SECRET_KEY;
      let url = "https://www.google.com/recaptcha/api/siteverify";

      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${key}&`
            + `response=${req.body['g-recaptcha-response']}`,
      })
      .then(response => response.json())
      .then(data => {
        res.locals.recaptcha = data;
        return next();
      });
    },
  },
}
