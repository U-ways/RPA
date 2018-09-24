/* Transactional emails
============================================================================= */

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
    from: { name: process.env.BOT_USERNAME, email: process.env.BOT_EMAIL, },
    subject: 'RPA - account locked',
    text: 'locked.txt',
    html: 'locked.mst',
    unlockURL: 'http://www.' + `${process.env.HOST}:${process.env.HTTP_PORT}`
      + `/app/unlock/${user.id}/${token}`,
    resetURL:  'http://www.' + `${process.env.HOST}:${process.env.HTTP_PORT}`
      + `/app/reset/${user.id}/${token}`,
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
    from: { name: process.env.BOT_USERNAME, email: process.env.BOT_EMAIL, },
    subject: 'RPA - Verify Email',
    text: 'verify.txt',
    html: 'verify.mst',
    verifyURL: 'http://www.' + `${process.env.HOST}:${process.env.HTTP_PORT}`
      + `/app/verify/${user.id}/${token}`,
  };
  return data;
}

/**
 * Send an email to allow user to password reset their account.
 * The email contains a token to prove account ownership on request.
 *
 * @param  {Object} user  the user instance to receive the email
 */
export async function passwordReset (user) {
  let token  = await user.generateToken();
  const data = {
    to:   { name: user.username, email: user.email,       },
    from: { name: process.env.BOT_USERNAME, email: process.env.BOT_EMAIL, },
    subject: 'RPA - password reset request',
    text: 'reset.txt',
    html: 'reset.mst',
    resetURL:  'http://www.' + `${process.env.HOST}:${process.env.HTTP_PORT}`
      + `/app/reset/${user.id}/${token}`,
  };
  return data;
}
