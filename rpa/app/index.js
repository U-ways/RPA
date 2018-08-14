/* Import core modules
============================================================================= */

import express        from 'express';
import dotenv         from 'dotenv/config';
import favicon        from 'serve-favicon';
import path           from 'path';
import sassMiddleware from 'node-sass-middleware';
import mustache       from 'mustache-express';
import cl             from '../lib/colorLogger.js';

/* Initialize express app
============================================================================= */

const ENV = process.env;
const APP = express();

/** prepare express body-parser **/

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

/** view engine setup */

let VIEWS_PATH = path.join(__dirname, 'mvc/views');

APP.engine('mst', mustache(VIEWS_PATH + '/partials', '.mst'));
APP.set('view engine', 'mst');
APP.set('views', VIEWS_PATH);

/** css preprocessor setup **/

APP.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

/* Server logger setup
============================================================================= */

import { httpLogger } from './middleware/httpLogger.js';

/** use simplified logger in development, else use production's logger */
APP.use(
  (ENV.NODE_ENV === '1') ?
    httpLogger.dev :
   (httpLogger.request, httpLogger.response)
);

/* Session set-up
============================================================================= */

import { sessionTracker } from './middleware/sessionTracker.js';
import { flashMessages }  from './middleware/flashMessages.js';

/** track users by creating a new session for each connection */
APP.use(new sessionTracker);
/**
 * Anything passed to `req.session.flash` will be passed to
 * `req.locals.flash` as a flash message.
 */
APP.use(flashMessages);

/* Static routing
============================================================================= */

APP.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
APP.use('/iconfont', express.static(__dirname
        + '/node_modules/material-design-icons/iconfont'));

APP.use(express.static(path.join(__dirname, 'public')));

/* Dynamic routing
============================================================================= */

/** Import controllers **/

import landingRouter from './mvc/controllers/landing';
import loginRouter from './mvc/controllers/login';
import logoutRouter from './mvc/controllers/logout';
import registerRouter from './mvc/controllers/register';
import dashboardRouter from './mvc/controllers/dashboard';

APP.use('/', landingRouter);
APP.use('/login', loginRouter);
APP.use('/logout', logoutRouter);
APP.use('/register', registerRouter);
APP.use('/dashboard', dashboardRouter);

/* Connecting database
============================================================================ */

import mongoose from 'mongoose';

let options  = { useNewUrlParser: true };

console.log(cl.act, '[app] connecting to database');

/** use development database on development environment */
if (ENV.NODE_ENV === '1') {
  mongoose.connect(ENV.DEV_DB_URI_ADMIN, options).then(mongoose => {
    console.log(cl.ok, '[app] connected to development database');

    return mongoose.connection.db.dropDatabase(() => {
      console.log(cl.warn, '[app] flushed development database');

      import('./mvc/models/User.js').then(({UserModel}) => {
        UserModel.create({
          username: ENV.ADMIN_USERNAME,
          password: ENV.ADMIN_PASSWORD,
          email:    ENV.ADMIN_EMAIL,
          logs: [{ activity: 0, description: 'root registration' }]
        }).then(admin => {
          console.log(cl.ok, `[app] created root account `
            + `named: ${admin.username} - email: ${admin.email}`);
        });
      });

    });
  })
  .catch(err => {
    console.log(cl.err,`[app] database: ${err.message}`);
    process.exit(1);
  });
}
/** else use production database */
else {
  mongoose.connect(ENV.PRO_DB_URI_USER, options).then(
    ()    => console.log(cl.ok, '[app] connected to production database'),
    error => {
      console.log(cl.err,`[app] database: ${error.message}`);
      process.exit(1);
    }
  );
}

/* Setting up GraphQL API
============================================================================= */

import API from './graphql';
/** middleware to restrict-access on protected pages */
import { restrictAccess } from './middleware/restrictAccess.js';

APP.use('/api', restrictAccess, API);

/* Error handlers
============================================================================= */

/** catch 404 errors and render 404 view  */
APP.use((req, res, next) => {
  let view = {
    title: `404 - Page Not Found`,
    stylesheets: [
      'iconfont/material-icons.css',
      'stylesheets/core.css',
      `stylesheets/404.css`
    ],
    message: 'No resource found matching the request-URI.',
    user: req.session.user,
  };
  return res.status(404).render('404', view);
});

/** main error handler */
APP.use((err, req, res, next) => {
  /** prepare response as a JSON object */
  let error = (ENV.NODE_ENV === '1') ? {
    dev: err.dev,
    stack: err.stack,
    filename: err.filename,
    error: err.message,
  } :
  { error: err.message };

  return res.status(err.status || 500).json(error);
});

export default APP;
