var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var jwt = require('jsonwebtoken');
var socketioJwt = require("socketio-jwt");


// ######### HTTP SERVER ############

var secret = 'secrets_should_never_be_checked_in';
var database = {}

// serve assets
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/javascripts", express.static(__dirname + '/javascripts'));

// serve main page
app.get('/:channel/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// issues JWTs for channels
app.get('/:channel/jwt', function(req, res){
  var token = jwt.sign({
    channel: req.params.channel
  }, secret, { expiresIn: 60 * 60 });

  console.log("Issuing JWT for", req.params.channel, " -", token);
  res.send(token);
});

// provide history for channels
app.get('/:channel/history', function(req, res){
  var channel = req.params.channel;
  if (channel in database) {
    res.send(database[req.params.channel]);
  } else {
    res.send({"error": "no history available"});
  }
});

http.listen(8888, function(){
  console.log('listening on *:8888');
});

// ######### WEB SOCKETS ############

var logSocketMessage = function(socket, action, message) {
  console.log(moment().format(), " - socket:", socket.id, "(", action, "):", JSON.stringify(message));
}

io.on('connection', socketioJwt.authorize({
  secret: secret,
  timeout: 15000
})).on('authenticated', function(socket){
  channel = socket.decoded_token.channel;
  console.log("Authenticated", socket.id,  "for channel", channel)

  socket.on('join_or_create_channel', function(){
    logSocketMessage(socket, 'join_or_create_channel', channel)

    socket.join(channel);
  });

  socket.on('message', function(msg){
    logSocketMessage(socket, 'message', msg)

    io.to(channel).emit('message', msg);

    if (database[channel] === undefined) {
      database[channel] = [];
    }
    database[channel].push(msg);
  });
});
