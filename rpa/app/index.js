/* Imports
============================================================================= */

import 'isomorphic-fetch';

import express        from 'express';
import favicon        from 'serve-favicon';
import path           from 'path';
import sassMiddleware from 'node-sass-middleware';
import mustache       from 'mustache-express';

/** app services **/

import { database } from './services/storage/database.js';
import { session  } from './services/storage/session.js';
import { emailService  } from './services/email/index.js';
import { api, graphiql } from './graphql';

/** app middlewares **/

import { httpLogger     } from './middleware/httpLogger.js';
import { sessionTracker } from './middleware/sessionTracker.js';
import { flashMessages  } from './middleware/flashMessages.js';
import { blockNonAuthUsers } from './middleware/blockNonAuthUsers.js';
import { blockNonVerfUsers } from './middleware/blockNonVerfUsers.js';
import { httpError      } from './middleware/httpError.js';

/** app controllers **/

import appRouter       from './mvc/controllers/app/index.js';
import homepageRouter  from './mvc/controllers/homepage/index.js';

/** turn all console logging off on production */
// if (process.env.NODE_ENV === 'production') console.off();

/* services
============================================================================= */

if (process.env.NODE_ENV === 'production') {
  database.connectToProduction();
  emailService.init().then(() => emailService.test());
}
else {
  database.connectToDevelopment();
  session.flush();
  emailService.init();
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

app.use( (process.env.NODE_ENV === 'production')
  ? (httpLogger.request, httpLogger.response)
  : httpLogger.dev
);

/** Session & flash setup */

app.use(new sessionTracker, flashMessages);

/** API setup */

app.use('/app/api', blockNonAuthUsers, api);
app.use('/app/debug', blockNonAuthUsers, blockNonVerfUsers, graphiql);

/* routing
============================================================================= */

/** static routes */

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

/** Dynamic routes */

app.use('/', homepageRouter);
app.use('/app', appRouter);

/* Error handlers
============================================================================= */

/** catch 404 errors and render 404 view  */
app.use(httpError[404]);

/** error handler for everything else */
app.use(httpError.all);

export default app;
