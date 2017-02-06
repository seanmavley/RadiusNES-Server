var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Admin = require('../models/admin');
var config = require('../config/database');
var md5 = require('blueimp-md5');
// var packunpack = require('../helpers/packunpack');

String.prototype.pad = function(length, padding) {
  var padding = typeof padding === 'string' && padding.length > 0 ? padding[0] : '\x00',
    length = isNaN(length) ? 0 : ~~length;
  return this.length < length ? this + Array(length - this.length + 1).join(padding) : this;
}

String.prototype.packHex = function() {
  var source = this.length % 2 ? this + '0' : this,
    result = '';
  for (var i = 0; i < source.length; i = i + 2) {
    result += String.fromCharCode(parseInt(source.substr(i, 2), 16));
  }
  return result;
}

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

router.get('/logon', function(req, res, next) {
  res.json({
    success: true,
    message: 'Logon page',
  });
})

router.post('/logon', function(req, res, next) {
  /*
    This will consume the password from the client, process it along with 
  */

  var challenge = req.body.challenge
    ,uamsecret = 'secret'
    ,password = req.body.password;

  var hexchal = challenge.packHex();
  var newchal = md5(hexchal + uamsecret).packHex();
  var response = md5('\0' + password + newchal);
  var newpwd = password.pad(31);
  var pappassword = '';
  for (var i = 0; i < newchal.length; i++) {
    pappassword += (newpwd.charCodeAt(i) ^ newchal.charCodeAt(i)).toString(16);
  }
  console.log("Response: --> ", response);
  console.log("New Password: -->", newpwd);
  console.log("Pap Password: --->", pappassword);

  res.json({
    success: true,
    message: req.body
  })
})

module.exports = router;
