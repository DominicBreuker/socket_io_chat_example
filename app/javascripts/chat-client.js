// add message to chat window
var addMessage = function(msg) {
  $('#messages').append($('<li>').text('(' + msg["channel"] + ') ' +
                                       msg["sender"] + ": " +
                                       msg["message"]));
};

var loadHistory = function(channel) {
  $.ajax({ url: channel + "/history" }).done(function(data) {
    for (var i = 0 ; i < data.length ; i++) { addMessage(data[i]) }
  });
}

window.onload = function() {
  var socket = io();
  var sender_id = Math.floor(Math.random() * 1000);
  document.title = "Chat: " + sender_id;
  var channel = window.location.pathname.split("/")[1];

  // join channel and load history
  socket.emit('join_or_create_channel', channel);
  loadHistory(channel);

  // send messages with socket.io
  $('#send_message')[0].addEventListener('click', function(evt){
    var message = $('#m').val();
    console.log("Emitting from client: ", message);
    socket.emit("message", {
      "channel": channel,
      "sender": sender_id,
      "message": message,
      "sent_at": Math.floor(Date.now())
    });
    $('#m').val('');
    evt.preventDefault();
  });

  // receive messages with socket.io
  socket.on('message', function(msg){ addMessage(msg) });
}
