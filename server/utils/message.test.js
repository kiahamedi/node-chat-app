const expect            = require('expect');

var {generateMessage}   = require('./message');

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