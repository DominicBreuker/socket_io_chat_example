var chatClient = {
  addMessage: function(msg) {
    $('#messages').append($('<li>').text(msg["sender"] + ": " +
                                         msg["message"]));
  },

  loadHistory: function(channel) {
    that = this;
    $.ajax({ url: channel + "/history" }).done(function(data) {
      for (var i = 0 ; i < data.length ; i++) { that.addMessage(data[i]) }
    });
  },

  authenticate: function(socket, channel) {
    $.ajax({ url: channel + "/jwt" }).done(function(data) {
      socket.on('connect', function(){
        var token = data;
        socket
          .emit('authenticate', {token: token})
          .on('authenticated', function() {
            console.log("Autenticated successfully using token", token);
          })
          .on('unauthorized', function(msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
            throw new Error(msg.data.type);
          });
      });
    });
  },

  sendMessage: function(message, sender_id, socket){
    console.log("Emitting from client: ", message);

    socket.emit("message", {
      "sender": sender_id,
      "message": message,
      "sent_at": Math.floor(Date.now())
    });
  }
}

// generate a random name
var randomName = function() {
  var names = ["Steffen", "Fabs", "Yousry", "Dominic"];
  return names[Math.floor(Math.random() * names.length)];
}

// initialize chat window
window.onload = function() {
  var socket = io();

  // identify and update current user
  var senderName = randomName()
  $('#sender-name').val(senderName);
  document.title = "Chat: " + senderName;
  $('#sender-name')[0].onchange = function() {
    senderName = $('#sender-name').val();
    document.title = "Chat: " + senderName;
  }

  // get channel name from URL
  var channel = window.location.pathname.split("/")[1];

  // authenticate with JWT
  chatClient.authenticate(socket, channel);

  // join channel and load history
  socket.emit('join_or_create_channel');
  chatClient.loadHistory(channel);

  // send messages on button click (enter works as well)
  $('#send_message')[0].addEventListener('click', function(evt){
    evt.preventDefault();

    var message = $('#m').val();
    chatClient.sendMessage(message, senderName, socket);
    $('#m').val('');
  });

  // add messages as they are received
  socket.on('message', chatClient.addMessage);
}
