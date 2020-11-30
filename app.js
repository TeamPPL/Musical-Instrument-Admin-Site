const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const shoppingCartRouter = require('./routes/checkout')
// const loginRouter = require('./routes/login');
// const signupRouter = require('./routes/signup');
const { handlebars } = require('hbs');
const hbs = require('express-handlebars');

const app = express();
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'index',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials/'
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
// app.use('/login', loginRouter);
// app.use('/signup', signupRouter);
app.use('/products', productsRouter);
// app.use('/detail', detailRouter);
app.use('/checkout', shoppingCartRouter)
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
