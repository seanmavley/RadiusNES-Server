var express = require('express');
var router = express.Router();
var User = require('../models/users');
var config = require('../config/database');
var passport = require('passport');

var mongoose = require('mongoose');

// usual promises is deprecated. 
// falling back to native es6 promises
mongoose.Promise = global.Promise;

/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  // respond with all users
  User.find({})
    .then(function(users) {
      res.json({ 'users': users });
    })
    .catch(function(error) {
      res.json({ 'error': error });
    })
});

router.post('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  console.log(req.body);
  // because User has a schema,
  // is this even a good idea, shoving all req.body
  // down mongodb's ass?
  var user = User(req.body);
  // let's commit to database
  user.save()
    .then(function(success) {
      res.json({ success: true, 'message': user });
    })
    .catch(function(err) {
      res.json({ success: false, 'error': error });
    })

})

module.exports = router;