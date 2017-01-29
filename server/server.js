// Setting up modules
const path       = require('path');
const http       = require('http');
const express    = require('express');
const socketIO   = require('socket.io');
// Setting up local variables
const publicPath = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;

// Setting up express 
var app = express();                        // uses http server
var server = http.createServer(app); 
var io = socketIO(server);                  // communicate between server and client
app.use(express.static(publicPath));

// Listen to a new connection from client
io.on('connection', (socket) => {
    console.log('New client connected');

/*-----------------------------Custom events begin-----------------------*/

    // listening to client's new message event 
    socket.on('createMessage', (newMessage) => {
        console.log('new message', newMessage);
        // sends client's new message to everyone on the url
        io.emit('newMessage', {
            from: newMessage.from,
            text: newMessage.text,
            createdAt: new Date().getTime()
        });
    });

/*-----------------------------Custom events end-----------------------*/

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`App succesfully started on ${PORT}`);
});