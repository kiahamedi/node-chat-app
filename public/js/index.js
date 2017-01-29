var socket = io();

socket.on('connect', function() {
    // Will print in browser console
    console.log('Connected to server');
});

/*-----------------------------Custom events begin-----------------------*/

// new message from server , shown in browser to chat app
socket.on('newMessage', function(message) {
    console.log('New message', message);

    // Adding new message to chat app 
    var li = $('<li></li>')
    li.text(`${message.from}: ${message.text}`);    
    $('#messages').append(li);
});

// When user submits form (message)
$('#message-form').on('submit', function (e){
    e.preventDefault();                     // prevents default form post behaviour

    socket.emit('createMessage', {
        from: 'User', 
        text: $('[name=message]').val()
    }, function(data) {
    console.log('Got it!', data);
    });
});

/*-----------------------------Custom events end-----------------------*/

socket.on('disconnect', function() {
    console.log('Disconnected to server');
});