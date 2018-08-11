/* Import core modules
============================================================================= */

import fileSystem     from 'fs';
import express        from 'express';
import dotenv         from 'dotenv/config';
import createError    from 'http-errors';
import favicon        from 'serve-favicon';
import path           from 'path';
import sassMiddleware from 'node-sass-middleware';
import mustache       from 'mustache-express';
import logger         from 'morgan';
import rfs            from 'rotating-file-stream';
import cl             from '../lib/colorLogger.js';

/** middleware to restrict-access on protected pages */
import { restrictAccess } from './middleware/restrictAccess.js';

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

const LOG_DIR = path.join(__dirname, '../log')
fileSystem.existsSync(LOG_DIR) || fileSystem.mkdirSync(LOG_DIR);

/** creates a rotating write stream */

let rotationLogging = rfs('http-server.log', {
  size: '5M',
  interval: '1d',
  compress: 'gzip',
  maxFiles: 90, // remove logs older than 3 months
  maxSize: '250M',
  path: LOG_DIR
});

let reqLogFormat =
'REQ :remote-addr     :method :url :req[header] :user-agent';

APP.use(logger(
  (ENV.NODE_ENV === '1') ? 'dev' :
    (reqLogFormat, {
      immediate: true,
      skip: (req, res) => res.statusCode < 400,
      stream: rotationLogging
    })
  )
);

let resLogFormat =
'RES :remote-addr :status :method :url :res[header] :res[content-length] :response-time ms';

if (ENV.NODE_ENV === '0') {
  APP.use(logger(resLogFormat, {
        skip: (req, res) => res.statusCode < 400,
        stream: rotationLogging
      }
    )
  );
}

/* Session set-up
============================================================================= */

import session from 'express-session';
import redis   from 'redis';
import connectRedis from 'connect-redis';
import { sessionGarbageCollector } from './middleware/sessionGarbageCollector.js';

/** initialize express session middleware */

const sessionTracker = () => {
  const client     = redis.createClient();
  const RedisStore = connectRedis(session);

  /** delete all existing keys within redis */
  client.flushall('ASYNC', (err, success) => {
    if (err) {
      let error = new Error('unable to flush existing session store.');
      if (ENV.NODE_ENV === '1') error.dev = err;
      return next(error);
    }
  });

  let secret  = [
    ENV.SECRET_1,
    ENV.SECRET_2,
    ENV.SECRET_3 ];
  let storeOptions = {
    host: ENV.HOST,
    port: parseInt(ENV.REDIS_PORT),
    client: client,
    logErrors: ENV.NODE_ENV === '1' ? true : false
  }
  let options = {
    name: 'RPA_session_cookie',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore(storeOptions),
    cookie: {
      path: '/',
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 minutes
    }
  }

  return session(options);
};

/** track sessions by assigning a unique hash for each connection */
APP.use(new sessionTracker);
/**
 * Anything passed to `req.session.temp` will be passed to `req.locals`
 * and garbage collected on every subsequent request.
 */
APP.use(sessionGarbageCollector);

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
APP.use('/dashboard', restrictAccess, dashboardRouter);

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
