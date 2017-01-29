// Setting up modules
const path              = require('path');
const http              = require('http');
const express           = require('express');
const socketIO          = require('socket.io');
const {generateMessage} = require('./utils/message');

// Setting up local variables
const publicPath = path.join(__dirname, '..', 'public');
const PORT       = process.env.PORT || 3000;

// Setting up express 
var app    = express();                        // uses http server
var server = http.createServer(app);
var io     = socketIO(server);                  // communicate between server and client
app.use(express.static(publicPath));

// Listen to a new connection from client
io.on('connection', (socket) => {
    console.log('New client connected');

/*-----------------------------Custom events begin-----------------------*/
    // When new user joins, he gets a greeting from the admin 
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // new user login is broadcast to all other users
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    // listening to client's create message event 
    // broadcasts the message to the entire chat app
    socket.on('createMessage', (message, callback) => {
        console.log('new message', message);
        // sends client's new message to entire chat app
        io.emit('newMessage', generateMessage(message.from, message.text));
        // If message is received, we acknowledge it
        callback('This is from the server');
    });

/*-----------------------------Custom events end-----------------------*/

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`App succesfully started on ${PORT}`);
});