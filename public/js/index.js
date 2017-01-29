var socket = io();

socket.on('connect', function() {
    // Will print in browser console
    console.log('Connected to server');
});

/*-----------------------------Custom events begin-----------------------*/

// new message from server , shown in browser
socket.on('newMessage', function(message) {
    console.log('New message', message);
});

/*-----------------------------Custom events end-----------------------*/

socket.on('disconnect', function() {
    console.log('Disconnected to server');
});