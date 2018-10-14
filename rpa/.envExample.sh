## Environment variables Config
#   Process.env docs:
#   https://nodejs.org/api/process.html#process_process_env

## Environment
#   production || development
NODE_ENV="development"

## HOST
HOST="localhost"

## PORTS
HTTP_PORT="3000"
REDIS_PORT="6379"

## Admin account
#   root account within RPA that always exist
ADMIN_USERNAME="admin"
ADMIN_EMAIL="admin@rpa.com"
ADMIN_PASSWORD="root"

## Bot account
#   bot account to verify emails
BOT_USERNAME="RPA-Bot"
BOT_PASSWORD="bot"
BOT_EMAIL="no-reply@rpa.com"

## bcrypt hash salt rounds
#   see: https://stackoverflow.com/a/46713082/5037430
SALT_ROUNDS="12"

## session cookie secret (used to sign the session ID cookie)
#   @see:  https://github.com/expressjs/session#secret
#   256-bit WEP Keys: https://randomkeygen.com/
SECRET_1="99F557F87E1CFD7CF5AB23F21E7D1"
SECRET_2="5DC554673B99DD4B83BF8E766E722"
SECRET_3="496A7AE21CDF3EC67217DAD89A1B1"

## database uri + username & password (replace USER,PASSWORD and DATABASE)
#   development
DEV_DB_URI_USER="mongodb+srv://USER:PASSWORD@prototype-db-hituj.mongodb.net/DATABASE"
DEV_DB_URI_ADMIN="mongodb+srv://ADMIN:PASSWORD@prototype-db-hituj.mongodb.net/DATABASE"
#   production
PRO_DB_URI_USER="mongodb+srv://USER:PASSWORD@prototype-db-hituj.mongodb.net/DATABASE"
PRO_DB_URI_ADMIN="mongodb+srv://ADMIN:PASSWORD@prototype-db-hituj.mongodb.net/DATABASE"

## reCaptcha keys:
#   @see: https://www.google.com/recaptcha/admin#site/342399025?setup
SITE_KEY=
SECRET_KEY=
# Keys for Invisible reCAPTCHA
#   @see: https://developers.google.com/recaptcha/docs/invisible
RECAP_INVIS_SITE_KEY=
RECAP_INVIS_SECRET_KEY=

## Email API key
#   Note: this is only used once on start-up.
SG_ADMIN_KEY=
