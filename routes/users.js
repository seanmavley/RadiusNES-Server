var express = require('express');
var router = express.Router();
var TestUser = require('../models/users');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/radius');
// usual promises is deprecated. 
// falling back to native es6 promises
mongoose.Promise = global.Promise;

/* GET users listing. */
router.get('/', function(req, res, next) {
  // respond with all users
  TestUser.find({})
    .then(function(users) {
      res.json({ 'users': users });
    })
    .catch(function(error) {
      res.json({ 'error': error });
    })
});

router.post('/', function(req, res, next) {
  var rex = TestUser({
    username: req.body.username,
    password: req.body.password
  });
  // let's commit to database
  rex.save()
    .then(function(success) {
      res.json({ 'message': rex });
    })
    .catch(function(err) {
      res.json({ 'error': error });
    })

})

module.exports = router;
