var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var Admin = require('../models/admin');
var config = require('../config/database');
var pack = require('bufferpack');
var md5 = require('blueimp-md5');

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

  /*
  This is the PHP PAP Password generation process 
  I've been attempting at replicating the results in Javascript.
  Not coming close and have no idea.

  $challenge = 'c731395aca5dcf45446c0ae83db5319e';
  $uamsecret = 'secret';
  $password = 'password';

  $hexchal = pack ("H32", $challenge);
  $newchal = pack ("H*", md5($hexchal . $uamsecret));
  $response = md5("\0" . $password . $newchal);
  $newpwd = pack("a32", $password);
  $pappassword = implode ("", unpack("H32", ($newpwd ^ $newchal)));

  echo "md5: ---> ", md5($hexchal . $uamsecret), "\n"; // 450b6cc3f8ffeda000dfe448fc483ce3
  echo "Response: ---> ", $response, "\n"; // 2d4bd27184f5eb032641137f728c6043
  echo "New Password: ---> ", $newpwd, "\n"; // password
  echo "Pap Password: ---> ", $pappassword, "\n"; // 356a1fb08f909fc400dfe448fc483ce3

  return values
  md5: ---> 450b6cc3f8ffeda000dfe448fc483ce3
  Response: ---> 2d4bd27184f5eb032641137f728c6043
  New Password: ---> password  
  Pap Password: ---> 356a1fb08f909fc400dfe448fc483ce3
  */

  /* 
    This is the javascript implementation of the above:
    Simple run the server and send a get request to localhost:3000/api/logon

    The values are hardcoded for simplicity at the moment.
  */
  var challenge = 'c731395aca5dcf45446c0ae83db5319e';
  var uamsecret = 'secret';
  var password = 'password';

  var hexchal = pack.pack("H32", challenge);
  var newchal = pack.pack("H*", md5(hexchal + uamsecret));
  var md5Only = md5(hexchal + uamsecret);
  var response = md5("\0" + password + newchal);
  var newpwd = pack.pack("a32", password);
  var pappassword = pack.unpack("H32", (newpwd ^ newchal)).join("");

  console.log("md5: --> ", md5Only);
  console.log("Response: --> ", response);
  console.log("New Password: -->", newpwd);
  console.log("Pap Password: --->", pappassword);

  /* Return values from console:
  md5: -->  916baa92512a1896763e5c8e21507ff4
  Response: -->  e8a54a55cbcd81dbc2bdfd9b197d62af
  New Password: --> <Buffer >
  Pap Password: ---> NaN
  */
  res.json({
    success: true,
    message: 'Logon page',
    md5: md5Only,
    hexchal: hexchal,
    newchal: newchal,
    newpwd: newpwd,
    response: response,
    pappassword: pappassword,
  });

  /* JSON Response:
  {
  "success": true,
  "message": "Logon page",
  "md5": "916baa92512a1896763e5c8e21507ff4",
  "hexchal": {
    "type": "Buffer",
    "data": [
      0,
      0
    ]
  },
  "newchal": {
    "type": "Buffer",
    "data": [
      0,
      9
    ]
  },
  "newpwd": {
    "type": "Buffer",
    "data": []
  },
  "response": "e8a54a55cbcd81dbc2bdfd9b197d62af",
  "pappassword": "NaN"
} 
*/
})

module.exports = router;
