/* Import core modules
============================================================================= */

import fileSystem     from 'fs';
import express        from 'express';
import dotenv         from 'dotenv/config';
import createError    from 'http-errors';
import favicon        from 'serve-favicon';
import path           from 'path';
import sassMiddleware from 'node-sass-middleware';
import logger         from 'morgan';
import rfs            from 'rotating-file-stream';
import cl             from './modules/colorLogger.js';

/* Initialize express app
============================================================================= */

const ENV = process.env;
const APP = express();

/** setup the server logger **/

const LOG_DIR = path.join(__dirname, 'log')
fileSystem.existsSync(LOG_DIR) || fileSystem.mkdirSync(LOG_DIR);

// create a rotating write stream
let rotationLogging = rfs('access.log', {
  size: '10M',
  interval: '1d',
  compress: 'gzip',
  maxFiles: 180, // remove logs older than 6 months
  maxSize: '500M',
  path: LOG_DIR
})

let logFormat =
':method :url :status :response-time ms :res[content-length] B';

APP.use(logger(
  ENV.NODE_ENV === 'development' ? 'dev' :
    logFormat, {
      // Log only 4xx and 5xx responses to console for non-dev environments
      skip: (req, res) => res.statusCode < 400,
      stream: rotationLogging
    }
  )
);

/** prepare express body-parser **/

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

/** view engine setup */

APP.set('view engine', 'ejs');
APP.set('views', path.join(__dirname, 'mvc/views'));

/** css preprocessor setup **/

APP.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

/* Session set-up
============================================================================= */

import session from 'express-session';
import redis   from 'redis';
import connectRedis from 'connect-redis';

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

/* Restrict-access middleware
============================================================================= */

function restrictAccess(req, res, next) {
  if (req.session.auth)
    return next();
  else
    return next(new Error('Please login to access this resource'));
}

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
import sandboxRouter from './mvc/controllers/sandbox';
import dashboardRouter from './mvc/controllers/dashboard';

APP.use('/', indexRouter);
APP.use('/login', loginRouter);
APP.use('/logout', logoutRouter);
APP.use('/sandbox', sandboxRouter);
APP.use('/dashboard', restrictAccess, dashboardRouter);

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

APP.use('/API', restrictAccess, API);

/* Error handlers
============================================================================= */

// catch 404 and forward to error handler
APP.use(function(req, res, next) {
  next(createError(404));
});

// error handler
APP.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default APP;
