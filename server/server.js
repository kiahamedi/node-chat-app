// Setting up modules
const path                                       = require('path');
const http                                       = require('http');
const express                                    = require('express');
const socketIO                                   = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString}                             = require('./utils/validation');

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

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required');
        }

        // socket.id()

        // socket io rooms
        socket.join(params.room);
        // When new user joins, he gets a greeting from the admin 
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // new user login is broadcast to all other users in the chat room
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    // listening to client's create message event 
    // broadcasts the message to the entire chat app
    socket.on('createMessage', (message, callback) => {
        console.log('new message', message);
        // sends client's new message to entire chat app
        io.emit('newMessage', generateMessage(message.from, message.text));
        // If message is received, we acknowledge it
        callback('This is from the server');
    });

    // Broadcasts location message to entire chat app
    socket.on('createLocationMessage', (message) => {
        console.log('new location message', message);

        io.emit('newLocationMessage', generateLocationMessage('Admin', message.latitude, message.longitude));
    });

/*-----------------------------Custom events end-----------------------*/

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`App succesfully started on ${PORT}`);
});