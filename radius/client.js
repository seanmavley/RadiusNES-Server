var express = require('express');
var router = express.Router();
var radius = require('radius');
var dgram = require('dgram');
var util = require('util');

var secret = 'secret';

var client = dgram.createSocket("udp4");
client.bind(49001);

// Take input from JSON body
// Do a packet var from the body
// Send it to server on 1812
// When a response comes in, send to console and res.json()

router.get('/', function(req, res, next) {
  res.json({ message: 'Send something to me' });
})

var sent_packets = {};

router.post('/', function(req, res, next) {
  console.log('The request that came in: ', req.body);

  var packet = req.body;

  var encoded = radius.encode(packet);
  console.log('Encoded packet: ', encoded);

  client.send(encoded, 0, encoded.length, 1812, 'localhost');

  sent_packets[packet.identifier] = {
    raw_packet: encoded,
    secret: packet.secret
  };

  client.on('message', function(msg, rinfo) {
    var response = radius.decode({ packet: msg, secret: secret });
    var request = sent_packets[response.identifier];

    var valid_response = radius.verify_response({
      response: msg,
      request: request.raw_packet,
      secret: request.secret
    });

    if (valid_response) {
      console.log('Got valid response ' + response.code + ' for packet id ' + response.identifier);
      // send a json response
      res.json({ 'response': response });
    } else {
      console.log('WARNING: Got invalid response ' + response.code + ' for packet id ' + response.identifier);
      // send a json response
      res.json({ 'error': response });
    }

    client.close();

  });
});

// sample packet that'll be sent
// var packet_accepted = {
//   "code": "Access-Request",
//   "secret": "secret",
//   "identifier": 0,
//   "attributes": [
//     ["NAS-IP-Address", "10.5.5.5"],
//     ["User-Name", "rexford"],
//     ["User-Password", "password"]
//   ]
// };

module.exports = router;
