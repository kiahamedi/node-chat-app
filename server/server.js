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
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`App succesfully started on ${PORT}`);
});