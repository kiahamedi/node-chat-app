const moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new moment().valueOf()
    };
};

var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from, 
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: new moment().valueOf()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};