# Socket.io chat example

This is a simple chat application built with socket.io.
People can connect to chatrooms and messages are broadcast within these rooms
to all connected browser windows.

## Try it out

Make sure you have Docker installed to start the server.
Use `bin/run.sh` to start the server, which will take care of building the
Docker image and starting the server.
Then go to [http://localhost:8888/channel1](http://localhost:8888/channel1)
to join `channel1`.
You will see an empty message window und two input boxes at the bottom of
the screen.
The left input box defines your name, the right one for creating messages.
Use the send button or press "Enter" to create messages.


Open another browser window, go to the same channel, and you get a new name.
Both browser windows can now chat with each other.
Identities are merely random names chosen from a list, so you may get the
same one twice.

![Screenshot of chat window with some text](images/example.png)
