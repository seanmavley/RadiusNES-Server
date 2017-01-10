var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

var User = new Schema({
  username: String,
  password: String,
  fullname: String,
  email: String,
  company: String,
  phone: String,
  address: String,
  state: String,
  city: String,
  country: String,
  zip: String,
  notes: String,
  createdAt: Date,
  createdBy: String,
  updatedBy: String
});

module.exports = mongoose.model('User', User);