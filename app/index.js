var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

var database = {}

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/javascripts", express.static(__dirname + '/javascripts'));

app.get('/:channel/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var log_socket_message = function(socket, action, message) {
  console.log(moment().format(), " - socket:", socket.id, "(", action, "):", JSON.stringify(message));
}

app.get('/:channel/history', function(req, res){
  var channel = req.params.channel;
  if (channel in database) {
    res.send(database[req.params.channel]);
  } else {
    res.send({"error": "no history available"});
  }
});

io.on('connection', function(socket){
  socket.on('join_or_create_channel', function(channel){
    log_socket_message(socket, 'join_or_create_channel', channel)

    socket.join(channel);
  })

  socket.on('message', function(msg){
    log_socket_message(socket, 'message', msg)

    io.to(msg['channel']).emit('message', msg);

    if (database[msg["channel"]] === undefined) {
      database[msg["channel"]] = [];
    }
    database[msg["channel"]].push(msg);
  });
});

http.listen(8888, function(){
  console.log('listening on *:8888');
});
