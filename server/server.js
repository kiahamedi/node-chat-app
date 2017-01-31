// Setting up modules
const path                                       = require('path');
const http                                       = require('http');
const express                                    = require('express');
const socketIO                                   = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString}                             = require('./utils/validation');
const {Users}                                    = require('./utils/users');

// Setting up local variables
const publicPath = path.join(__dirname, '..', 'public');
const PORT       = process.env.PORT || 3000;

// Setting up express 
var app    = express();                        // uses http server
var server = http.createServer(app);
var io     = socketIO(server);                  // communicate between server and client
var users  = new Users();
app.use(express.static(publicPath));

// Listen to a new connection from client
io.on('connection', (socket) => {
/*-----------------------------Custom events begin-----------------------*/

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }

        // socket io rooms
        socket.join(params.room);
        // adding user to user list after removing user from all chat rooms
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        // emitting updated list to entire chat room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // When new user joins, he gets a greeting from the admin 
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        // new user login is broadcast to all other users in the chat room
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    // listening to client's create message event 
    // broadcasts the message to the entire chat app
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        // sends client's new message to entire chat app
        if (user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));    
        }
        
        // If message is received, we acknowledge it
        callback('This is from the server');
    });

    // Broadcasts location message to entire chat app
    socket.on('createLocationMessage', (message) => {
        var user = users.getUser(socket.id);

        if (user){
            var name = user.name;
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(`${name}`, message.latitude, message.longitude));    
        }
    });

/*-----------------------------Custom events end-----------------------*/

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        
        if (user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room)); // sending updated user list
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});

server.listen(PORT, () => {
    console.log(`App succesfully started on ${PORT}`);
});