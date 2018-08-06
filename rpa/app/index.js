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

APP.engine('mst', mustache());
APP.set('view engine', 'mst');
APP.set('views', path.join(__dirname, 'mvc/views'));

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
  (ENV.NODE_ENV === 'development') ? 'dev' :
    (reqLogFormat, {
      immediate: true,
      skip: (req, res) => res.statusCode < 400,
      stream: rotationLogging
    })
  )
);

let resLogFormat =
'RES :remote-addr :status :method :url :res[header] :res[content-length] :response-time ms';

if (ENV.NODE_ENV === 'production') {
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

/** initialize express session */

const trackSession = (() => {
  const client     = redis.createClient();
  const RedisStore = connectRedis(session);
  let secret  = [
    ENV.SECRET_1,
    ENV.SECRET_2,
    ENV.SECRET_3 ];
  let storeOptions = {
    host: ENV.HOST,
    port: parseInt(ENV.REDIS_PORT),
    client: client,
    logErrors: ENV.NODE_ENV === 'development' ? true : false
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
})();

APP.use(trackSession);
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

import indexRouter from './mvc/controllers/index';
import loginRouter from './mvc/controllers/login';
import logoutRouter from './mvc/controllers/logout';
import registerRouter from './mvc/controllers/register';
import sandboxRouter from './mvc/controllers/sandbox';
import dashboardRouter from './mvc/controllers/dashboard';

APP.use('/', indexRouter);
APP.use('/login', loginRouter);
APP.use('/logout', logoutRouter);
APP.use('/register', registerRouter);
APP.use('/dashboard', restrictAccess, dashboardRouter);
APP.use('/sandbox', sandboxRouter);

/* Connecting database
============================================================================ */

import mongoose from 'mongoose';

let options  = { useNewUrlParser: true };
mongoose.connect(ENV.DB_URI_USER, options).then(
  ()    => { console.log(cl.ok, '[app] Connected to database');      },
  error => { console.log(cl.err,`[app] Database: ${error.message}`); }
);

/* Setting up GraphQL APIs
============================================================================= */

import API from './graphql';

APP.use('/api', restrictAccess, API);

/* Error handlers
============================================================================= */

// catch 404 and forward to error handler
APP.use((req, res, next) => {
  let error = new Error('The server has not found anything matching the Request-URI.');
  error.name = 'Not Found';
  error.status = 404;
  next(error);
});

// error handler
APP.use((err, req, res, next) => {
  // set locals, only providing error in development
  let devView = (ENV.NODE_ENV === 'development') ?
    { caught: err.caught, stack: err.stack }
    : null;

  let view = {
    title: err.name,
    status: err.status,
    message: err.message,
    error: devView
  }

  res.status(err.status || 500);
  res.render('error', view);
});

export default APP;
