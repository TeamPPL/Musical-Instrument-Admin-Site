const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const productsRouter = require('./routes/products');
const auth = require('./authenticate/auth');
const receiptRouter = require('./routes/receipt');
const { handlebars } = require('hbs');
const hbs = require('express-handlebars');

const app = express();
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'index',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    minus: function(a, b) {
      return a - b;
    }
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,
      maxAge: 3600000 //1 hour
  }
})
);

auth(app);
app.use(flash());

//global user info on header bar
app.use((req, res, next) => {
  let userInfo =
    {
      isLogin: req.isAuthenticated(),
      info: req.user
    }

  res.locals.userInfo = userInfo;

  let message = {
    info: req.flash('message-info'),
    warning: req.flash('message-warning'),
    danger: req.flash('message-danger'),
    error: req.flash('error'),
  }
  console.log(message);
  res.locals.message = message;
  next();
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/products', productsRouter);
// app.use('/detail', detailRouter);
app.use('/receipt', receiptRouter);
/*
app.use('/login', (req, res) => {
  res.render('login');
})
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('error404');
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
