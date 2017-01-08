var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');

var config = require('./config/database');

mongoose.connect(config.radiusDB);

// Models
var TestUser = require('./models/users');

// Routes
var index = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var admin = require('./routes/admin');
var radclient = require('./radius/client');

// Radius Server
require('./radius/server');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/', index);
app.use('/api', api);
app.use('/users', users);
app.use('/radclient', radclient);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
  // res.json('error');
});

module.exports = app;
