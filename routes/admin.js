var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var config = require('../config/database');
var passport = require('passport');

var jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

var User = require('../models/admin');

/* 
  ADMIN ROUTES 
  route as /admin/
*/
router.get('/', function(req, res, next) {
  res.json({ message: 'Admin Pages' });
});

router.get('/signup', function(req, res, next) {
  res.json({ message: 'Sign Up page' });
})

router.post('/signup', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    res.json({
      success: false,
      message: 'Dude, you are already logged in'
    });
  } else {
    if (!req.body.email || !req.body.password) {
      res.json({ success: false, message: 'No Email or password', sent: req.body });
    } else {
      var newUser = new User();
      newUser.local.email = req.body.email;
      newUser.local.password = newUser.generateHash(req.body.password);

      newUser.save(function(err) {
        if (err) {
          // mongo duplicate error code
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: "The user you're trying to create already exist"
            });
          }
          return res.json({
            success: false,
            message: err
          })
        }
        res.json({ success: true, message: 'Successfully created user' });
      });
    }
  }
});

router.get('/login', function(req, res, next) {
  res.json({ message: 'This is for login' });
})

router.post('/login', function(req, res, next) {

  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: 'No password or email entered'
    });
  } else {
    // req.body is not empty
    var email = req.body.email;

    User.findOne({ 'local.email': email })
      .then(function(user) {
        // not found
        if (!user) {
          res.send({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        }

        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user, config.secret, {
              expiresIn: 14440
            });
            // return the information including token as JSON
            res.json({ success: true, token: 'JWT ' + token });
          } else {
            res.send({ success: false, message: 'Authentication failed. Wrong password.' });
          }
        });
      })
      .catch(function(err) {
        if (err) throw err;
      })
  }
})

router.get('/administrator', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  res.json({ success: true, message: 'Without authentication' });
})

router.post('/administrator', function(req, res, next) {
  res.json({ success: true, message: 'a Post' });
})

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
