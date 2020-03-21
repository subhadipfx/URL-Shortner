const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const useragent = require('express-useragent');
const expressip = require('express-ip');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const auth = require('./src/middleware/passport-config');
const hbs = require('./src/middleware/handelbars');
const connectDB = require('./src/db/connection');
require('./src/Crons/cron_job');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const URLRouter = require('./routes/URLRouter');
const profileRouter = require('./routes/profileRouter');
const redirectRouter = require('./routes/redirectRouter');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine("hbs", hbs.engine);
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/user', authRouter);
app.use('/url',URLRouter);
app.use('/user/profile',profileRouter);
app.use(redirectRouter);
auth(passport);
connectDB();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
