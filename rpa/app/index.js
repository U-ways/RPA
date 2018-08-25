/* Imports
============================================================================= */

import express        from 'express';
import dotenv         from 'dotenv/config';
import favicon        from 'serve-favicon';
import path           from 'path';
import sassMiddleware from 'node-sass-middleware';
import mustache       from 'mustache-express';
import { cl }         from '../lib/colorLogger.js';

import API from './graphql';

/** APP services **/

import { database } from './services/storage/database.js';
import { memory   } from './services/storage/memory.js';
import { email    } from './services/email/index.js';

/** APP middlewares **/

import { httpLogger     } from './middleware/httpLogger.js';
import { sessionTracker } from './middleware/sessionTracker.js';
import { flashMessages  } from './middleware/flashMessages.js';
import { blockNonAuthUsers } from './middleware/blockNonAuthUsers.js';
import { httpError      } from './middleware/httpError.js';

/** APP controllers **/

import landingRouter   from './mvc/controllers/landing';
import loginRouter     from './mvc/controllers/login';
import logoutRouter    from './mvc/controllers/logout';
import verifyRouter    from './mvc/controllers/verify';
import registerRouter  from './mvc/controllers/register';
import dashboardRouter from './mvc/controllers/dashboard';

const ENV = process.env;

/* services
============================================================================= */

/** database setup */

if (ENV.NODE_ENV === 'production') database.connectToProduction();
else                               database.connectToDevelopment();

/** memory setup */

if (ENV.NODE_ENV === 'development') memory.flush();

/** email setup */

if (ENV.NODE_ENV === 'production') email.init().then(() => email.test());
else                               email.init();

/* Initialize app
============================================================================= */

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

/** Server logger setup */

APP.use(
  (ENV.NODE_ENV === 'production') ?
    (httpLogger.request, httpLogger.response)
    : httpLogger.dev
);

/** Session & flash setup */

APP.use(new sessionTracker, flashMessages);

/** API setup */

APP.use('/api', blockNonAuthUsers, API);

/* routing
============================================================================= */

/** static routes */

APP.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
APP.use(express.static(__dirname + '/public'));
APP.use(express.static(__dirname + '/node_modules/material-design-icons/iconfont'));

/** Dynamic routes */

APP.use('/', landingRouter);
APP.use('/login', loginRouter);
APP.use('/logout', logoutRouter);
APP.use('/verify', verifyRouter);
APP.use('/register', registerRouter);
APP.use('/dashboard', dashboardRouter);

/* Error handlers
============================================================================= */

/** catch 404 errors and render 404 view  */
APP.use(httpError[404]);

/** error handler for everything else */
APP.use(httpError.all);

export default APP;
