var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var config = require('../config/database');
var passport = require('passport');

var jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

var User = require('../models/admin');

/* GET home page. */
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

router.post('/login', function(req, res) {
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

        if (!user) {
          res.send({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        }
      })
  }
});
// Post to update Profile
router.post('/administrator', passport.authenticate('jwt', { session: false }), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.verify(token, config.secret);
    User.findOne({ 'local.email': decoded.local.email })
      .then(function(err, user) {
        var query = { 'local.email': decoded.local.email };
        User.findOneAndUpdate({ query }, { 'local.name': req.body.fullname });

        res.json({
          success: true,
          message: 'Update successful',
        });
      })
      .catch(function(err) {
        if (err) throw err;
        if (!user) {
          return res.status(403).send({ success: false, message: 'Authentication failed, user not found' });
        }
      })
  }
})

// Administrator Page
router.get('/administrator', function(req, res, next) {
  passport.authenticate('jwt', { session: false }, function(err, user, info) {
    // TODO: selectively return without password
    if (err) {
      return res.json({ success: false, message: err })
    }
    if (!user) {
      return res.json({ sucess: false, message: 'Authentication failed. No user found!' })
    } else {
      res.json({
        sucess: true,
        message: 'Successful',
        user: user,
        info: info
      })
    }
  })(req, res, next)
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
