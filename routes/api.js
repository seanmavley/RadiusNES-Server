var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Admin = require('../models/admin');
var config = require('../config/database');

var mongoose = require('mongoose');

// usual promises is deprecated. 
// falling back to native es6 promises
mongoose.Promise = global.Promise;

/* 
  API Routes
  route as /api/
*/
router.get('/', function(req, res, next) {
  res.json({ message: 'Hooray! Welcome to our API' });
});

module.exports = router;
