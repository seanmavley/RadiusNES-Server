var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var Admin = require('../models/admin');
var config = require('./database');

module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log('Payload received', jwt_payload);
    Admin.findOne({ id: jwt_payload.id }, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
