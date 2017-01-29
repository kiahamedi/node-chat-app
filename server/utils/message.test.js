const expect                                   = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    // sync test, so it doesn't need a done
    it('should generate the correct message object', () => {
        var from =  'Admin';
        var text =  'Welcome to the chat app';

        var message = generateMessage(from, text);

        expect(message).toInclude({from, text});
        expect(message.createdAt).toBeA('number');
    }); 
});

describe('generateLocationMessage', () => {
    // sync test, so it doesn't need a done
    it('should generate the correct location message object', () => {
        var from =  'Admin';
        var latitude = 74.44;
        var longitude = 35.66;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        var message = generateLocationMessage(from, latitude, longitude);

        expect(message).toInclude({from, url});
        expect(message.createdAt).toBeA('number');
    }); 
});