var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var config = require('../config/database');

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

// define the schema for our user model
var AdminSchema = new Schema({
  local: {
    email: String,
    password: String,
    name: String
  }

});

// AdminSchema.pre('save', function(next) {
//   var user = this;
//   if (this.isModified('local.password') || this.isNew) {
//     bcrypt.genSalt(10, function(err, salt) {
//       if (err) {
//         return next(err);
//       }
//       bcrypt.hash(user.local.password, salt, function(err, hash) {
//         if (err) {
//           return next(err);
//         }
//         user.local.password = hash;
//         next();
//       });
//     });
//   } else {
//     return next();
//   }
// });

AdminSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.local.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

AdminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// // checking if password is valid
// AdminSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

module.exports = mongoose.model('Operator', AdminSchema);