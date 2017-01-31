var socket         = io();
var locationButton = $('#send-location');

// auto-scrolling if user can see the bottom most message
function scrollToBottom() {
    // Selectors
    var messages          = $('#messages');
    var newMessage        = messages.children('li:last-child'); // last child of list

    // Heights
    var clientHeight      = messages.prop('clientHeight');
    var scrollTop         = messages.prop('scrollTop');
    var scrollHeight      = messages.prop('scrollHeight');
    var newMessageHeight  = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    // if messages have overloaded into below the screen
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
};

// Joining a room
socket.on('connect', function() {
    // Will print in browser console
    console.log('Connected to server');

    // name and chat room info
    var params = $.deparam(window.location.search);

    // Joining a chat room
    socket.emit('join', params, function (err){
        if (err){
            alert(err);
            window.location.href = '/'; // redirecting to index.html
        } else {
            console.log('No error');
        }
    });
});

/*-----------------------------Custom events begin-----------------------*/

// new message from server , shown in browser to chat app
socket.on('newMessage', function(message) {
    var formattedTime = new moment(message.createdAt).format('h:mm a')

    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

// new location message from server , shown in browser to chat app
socket.on('newLocationMessage', function(message) {
    var formattedTime = new moment(message.createdAt).format('h:mm a');

    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime 
    });

    $('#messages').append(html);
    scrollToBottom();
});

// When user submits form (message)
$('#message-form').on('submit', function (e){
    e.preventDefault();                     // prevents default form post behaviour

    var messageTextBox = $('[name=message');

    socket.emit('createMessage', {
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

// update chat room list
socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>');

    users.forEach(function (user){
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

/*-----------------------------Custom events end-----------------------*/

socket.on('disconnect', function() {
    console.log('Disconnected to server');
});