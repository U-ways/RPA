/* Imports
============================================================================= */

import express        from 'express';
import dotenv         from '../lib/dotenv.js';
import favicon        from 'serve-favicon';
import path           from 'path';
import sassMiddleware from 'node-sass-middleware';
import mustache       from 'mustache-express';

/** app services **/

import { database } from './services/storage/database.js';
import { session  } from './services/storage/session.js';
import { Email    } from './services/email/index.js';
import { api      } from './graphql';

/** app middlewares **/

import { httpLogger     } from './middleware/httpLogger.js';
import { sessionTracker } from './middleware/sessionTracker.js';
import { flashMessages  } from './middleware/flashMessages.js';
import { blockNonAuthUsers } from './middleware/blockNonAuthUsers.js';
import { httpError      } from './middleware/httpError.js';

/** app controllers **/

import landingRouter   from './mvc/controllers/landing.js';
import loginRouter     from './mvc/controllers/login.js';
import logoutRouter    from './mvc/controllers/logout.js';
import verifyRouter    from './mvc/controllers/verify.js';
import registerRouter  from './mvc/controllers/register.js';
import dashboardRouter from './mvc/controllers/dashboard.js';
import unlockRouter    from './mvc/controllers/unlock.js';
import resetRouter     from './mvc/controllers/reset.js';

const env = process.env;

/** turn all console logging off on production */
if (env.NODE_ENV === 'production') console.off();

/* services
============================================================================= */

if (env.NODE_ENV === 'production') {
  database.connectToProduction();
  Email.init().then(() => Email.test());
}
else {
  database.connectToDevelopment();
  session.flush();
  Email.init();
}

/* Initialize app
============================================================================= */

const app = express();

/** prepare express body-parser **/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** view engine setup */

app.engine('mst', mustache(__dirname + '/mvc/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/mvc/views');

/** css preprocessor setup **/

app.use(sassMiddleware({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

/** Server logger setup */

app.use( (env.NODE_ENV === 'production')
  ? (httpLogger.request, httpLogger.response)
  : httpLogger.dev
);

/** Session & flash setup */

app.use(new sessionTracker, flashMessages);

/** API setup */

app.use('/api', blockNonAuthUsers, api);

/* routing
============================================================================= */

/** static routes */

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/material-design-icons/iconfont'));
app.use(favicon(__dirname + '/public/favicon.ico'));

/** Dynamic routes */

app.use('/', landingRouter);

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.use('/reset', resetRouter);
app.use('/unlock', unlockRouter);
app.use('/verify', verifyRouter);

app.use('/register', registerRouter);
app.use('/dashboard', dashboardRouter);

/* Error handlers
============================================================================= */

/** catch 404 errors and render 404 view  */
app.use(httpError[404]);

/** error handler for everything else */
app.use(httpError.all);

export default app;
