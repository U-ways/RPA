let loginForm = document.querySelector('#login-form');
loginForm.addEventListener("submit", formHandler);

function formHandler() {
  /** W3C Email regex: goo.gl/NQgCtK (Based on RFC5322) **/
  const email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  /** Must starts with a letter then can include underscores (_) & hyphens (-) **/
  const username_regex = /^[a-zA-Z][\w-]+$/;

  let input = document.querySelector('#username-or-email');

  if (email_regex.test(input.value)) {
    console.log("setting as email");
    // it is an email, send body value as an email
    input.setAttribute("name", "email");
  } else if (username_regex.test(input.value)) {
    console.log("setting as username");
    // it is a username, send body value as a username
    input.setAttribute("name", "username");
  } else {
    // invalid email or username format, return an error message to user
  }

}
