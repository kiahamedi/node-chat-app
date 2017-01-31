const expect       = require('expect');

var {isRealString} = require('./validation');

describe('Is Real String', () => {
    it('should reject non-string values', () => {
        var validation = isRealString(98);

        expect(validation).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var validation = isRealString("     ");

        expect(validation).toBe(false);
    });

    it('should allow strings with non space characters', () => {
        var validation = isRealString("string");

        expect(validation).toBe(true);
    });
});