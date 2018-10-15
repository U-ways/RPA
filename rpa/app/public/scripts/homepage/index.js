/* homepage script
============================================================================= */

const closedSidebarIcon = sidebar.querySelector('#closed-sidebar-icon');
const registrationForm  = sidebar.querySelector('#register-form');

const loginSection = sidebar.querySelector('#login');

/** Toggle a password reset form on click */
loginSection.querySelector('#forgot').addEventListener('click', toggleResetForm);;

/**
 * Display a password-reset form if data-toggle not set, otherwise display
 * a login form.
 *
 * The password-reset form is created from the login-form by changing
 * its attributes and actions on click.
 */
function toggleResetForm (event) {
  let p    = this;
  let form = loginSection.querySelector('#login-form');
  let btn  = form.querySelector('button');
  let psw  = form.querySelector('input[type=password]');

  psw.classList.toggle('locked');
  btn.classList.toggle('danger');

  if (p.getAttribute('data-toggle')) {
    form.action = '/app/login'
    form.method = 'POST'
    btn.innerHTML = 'Login';
    btn.title     = 'Login';
    p.removeAttribute('data-toggle');
    p.innerHTML   = 'Forgotten your password?';
    psw.setAttribute('name', 'password');
    psw.required  = true;
    psw.readOnly  = false;
    psw.placeholder = 'Password'
  }
  else {
    form.action = '/app/reset/request'
    form.method = 'GET'
    btn.innerHTML = 'Request';
    btn.title     = 'Request a password reset';
    p.setAttribute('data-toggle', true);
    p.innerHTML   = 'Back to Login...';
    psw.removeAttribute('name');
    psw.placeholder = 'request a password reset';
    psw.required = false;
    psw.readOnly = true;
    psw.value = null;
  }
}

/** topbar chevron icon */
let chevronIcon = chevron.querySelector('i');
/** allow expanding sidebar from the closed-sidebar-icon */
closedSidebarIcon.addEventListener('click', toggleSidebar);
/** sidebar is expanded by default on landing page */
chevronIcon.classList.replace( 'fa-chevron-right', 'fa-chevron-left' );
