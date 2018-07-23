/* Import node modules
============================================================================= */
import createError    from 'http-errors';
import cookieParser   from 'cookie-parser';
import dotenv         from 'dotenv/config';
import express        from 'express';
import favicon        from 'serve-favicon';
import path           from 'path';
import logger         from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import cl             from './modules/colorLogger.js';

/* Connecting database
============================================================================ */
import mongoose from 'mongoose';

let options  = { useNewUrlParser: true };
mongoose.connect(process.env.DB_URI, options).then(
  ()    => { console.log(cl.ok, '[app] Connected to database');      },
  error => { console.log(cl.err,`[app] Database: ${error.message}`); }
);

/* Import BSA routes
============================================================================= */
import indexRouter   from './mvc/controllers/index';
import sandboxRouter from './mvc/controllers/sandbox';
/** Demo **/
let demo = true;
if (demo) import('./demo');

/* Initialize express app
============================================================================= */
const app = express();

/** View engine setup */
app.set('views', path.join(__dirname, 'mvc/views'));
app.set('view engine', 'ejs');

/** Initial modules setup & static Routing */
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/iconfont', express.static(__dirname
        + '/node_modules/material-design-icons/iconfont'));

/* Setting up GraphQL APIs
============================================================================= */
import API from './graphql';
app.use('/API', API);

/* Dynamic routing
============================================================================= */
app.use('/', indexRouter);
app.use('/sandbox', sandboxRouter);

/* Error handlers
============================================================================= */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
