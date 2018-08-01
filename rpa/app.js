/* Import node modules
============================================================================= */
import express        from 'express';
import dotenv         from 'dotenv/config';
import createError    from 'http-errors';
import favicon        from 'serve-favicon';
import path           from 'path';
import logger         from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import cl             from './modules/colorLogger.js';

/* Initialize express app
============================================================================= */
const app = express();

app.use(logger('dev'));

/** prepare express body-parser **/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** View engine setup */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'mvc/views'));

/** css preprocessor setup **/
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

/* Session set-up
============================================================================= */
import session from 'express-session';

/** Initialize express session */

const trackSession = (() => {
  let secret  = [
    process.env.SECRET_1,
    process.env.SECRET_2,
    process.env.SECRET_3 ];
  let options = {
    name: 'RPA_session_cookie',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      secure: false,
      maxAge: 30 * 60 * 1000, // 30 minutes
    }
  }
  return session(options);
})();

app.use(trackSession);


/* Static routing
============================================================================= */

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/iconfont', express.static(__dirname
        + '/node_modules/material-design-icons/iconfont'));

app.use(express.static(path.join(__dirname, 'public')));

/* Dynamic routing
============================================================================= */
/** Import controllers **/
import indexRouter   from './mvc/controllers/index';
import loginRouter   from './mvc/controllers/login';
import logoutRouter  from './mvc/controllers/logout';
import sandboxRouter from './mvc/controllers/sandbox';

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/sandbox', sandboxRouter);

/* Connecting database
============================================================================ */
import mongoose from 'mongoose';

let options  = { useNewUrlParser: true };
mongoose.connect(process.env.DB_URI_USER, options).then(
  ()    => { console.log(cl.ok, '[app] Connected to database');      },
  error => { console.log(cl.err,`[app] Database: ${error.message}`); }
);

/* Setting up GraphQL APIs
============================================================================= */
import API from './graphql';

app.use('/API', API);

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
