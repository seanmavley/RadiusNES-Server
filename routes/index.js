var express = require('express');
var router = express.Router();

/* 
  ROOT ROUTES
  route as /
*/
router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to RadiusNES Server Homepage'});
});

module.exports = router;
