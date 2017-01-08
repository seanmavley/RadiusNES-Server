// Node Radius Server
var radius = require('radius');
var dgram = require("dgram");

var secret = 'secret';
var server = dgram.createSocket("udp4");

var TestUser = require('../models/users');

server.on('message', function(msg, rinfo) {
  var code, username, password, packet;

  try {
    packet = radius.decode({ packet: msg, secret: secret });
    console.log('After decoding, I look like this: ', packet);
  } catch (e) {
    console.log("Failed to decode radius packet, silently dropping:", e);
    return;
  }

  if (packet.code != 'Access-Request') {
    console.log('Unknown packet type: ', packet.code);
    return;
  }

  username = packet.attributes['User-Name'];
  password = packet.attributes['User-Password'];

  console.log('Access-Request for ' + username + ' with password ' + password);

  // Check if user exist from Database.
  TestUser.findOne({ username: 'rexford' })
    .then(function(user) {
      console.log('User returned, namely, ' + user);
      if (user.username == username && user.password == password) {
        code = 'Access-Accept';
      } else {
        code = 'Access-Reject'
      }

      var response = radius.encode_response({
        packet: packet,
        code: code,
        secret: secret
      });

      console.log('Sending ' + code + ' for user ' + user.username);

      server.send(response, 0, response.length, rinfo.port, rinfo.address, function(err, bytes) {
        if (err) {
          console.log('Error sending response to ', rinfo);
        }
      });

    })
    .catch(function(err) {
      console.log(error);
    })

});

server.on("listening", function() {
  var address = server.address();
  console.log("radius server listening " +
    address.address + ":" + address.port);
});

server.bind(1812);
