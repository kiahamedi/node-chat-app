var socket         = io();
var locationButton = $('#send-location');

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

// new location message from server , shown in browser to chat app
socket.on('newLocationMessage', function(message) {
    console.log('New location message', message);

    // Adding new message to chat app 
    var li = $('<li></li>');
    // target gets the link to open in a new tab
    var a = $('<a target="_blank">My current location</a>'); 
    li.text(`${message.from}: `);    
    // Setting a hyperlink of the google map location
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

// When user submits form (message)
$('#message-form').on('submit', function (e){
    e.preventDefault();                     // prevents default form post behaviour

    var messageTextBox = $('[name=message');

    socket.emit('createMessage', {
        from: 'User', 
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
});

// When user wants to send location
locationButton.on('click', function () {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    // setting disabled attribute to disabled until execution is complete
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    }, function (){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});

/*-----------------------------Custom events end-----------------------*/

socket.on('disconnect', function() {
    console.log('Disconnected to server');
});