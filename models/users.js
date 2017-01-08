var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestUserSchema = new Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('UserSchema', TestUserSchema);