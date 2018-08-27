/* Transactional emails
============================================================================= */

const env = process.env;

/**
 * Send an email to allow user to password reset or terminate locked session.
 * The email contains a token to prove account ownership on request.
 *
 * @param  {Object} user  the user instance to receive the email
 */
export async function lockoutUser (user) {
  let token  = await user.generateToken();
  const data = {
    to:   { name: user.username, email: user.email,       },
    from: { name: env.BOT_USERNAME, email: env.BOT_EMAIL, },
    subject: 'RPA - account locked',
    text: 'locked.txt',
    html: 'locked.mst',
    unlockURL: 'http://www.' + `${env.HOST}:${env.HTTP_PORT}`
      + `/unlock/${user.id}/${token}`,
    resetURL:  'http://www.' + `${env.HOST}:${env.HTTP_PORT}`
      + `/reset/${user.id}/${token}`,
  };
  return data;
}

/**
 * Send a verification email to verify user's email.
 * The email contains a token to prove email ownership on request.
 *
 * @param  {Object} user  the user instance to receive the email
 */
export async function verifyEmail (user) {
  let token  = await user.generateToken();
  const data = {
    to:   { name: user.username, email: user.email,       },
    from: { name: env.BOT_USERNAME, email: env.BOT_EMAIL, },
    subject: 'RPA - Verify Email',
    text: 'verify.txt',
    html: 'verify.mst',
    verifyURL: 'http://www.' + `${env.HOST}:${env.HTTP_PORT}`
      + `/verify/${user.id}/${token}`,
  };
  return data;
}
