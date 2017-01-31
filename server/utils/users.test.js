const expect = require('expect');

var {Users}  = require('./users');

describe('Users class', () => {

    beforeEach(() => {
        users = new Users();
        users.users = [{
                id: 1,
                name: 'Mayank',
                room: 'Node JS'
            }, {
                id: 2,
                name: 'Jen',
                room: 'React JS'
            }, {
                id: 3,
                name: 'Binnu',
                room: 'Node JS'
        }];
    });

    it('should add a new user', () => {
        var users = new Users();

        var user = users.addUser(123, 'Mayank', 'Office Fans');

        expect(users.users).toExist();

        expect(user).toInclude({
            id: 123,
            name: 'Mayank',
            room: 'Office Fans',
        });
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node JS');

        expect(userList).toEqual(['Mayank', 'Binnu']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React JS');

        expect(userList).toEqual(['Jen']);
    });

    it('should find a user', () => {
        var user = users.getUser(1);

        expect(user.id).toEqual(1);
    });

    it('should not find a user', () => {
        var user = users.getUser(5); // id not part of seed array

        expect(user).toNotExist();
    });

    it('should remove a user', () => {
        var user = users.removeUser(1);

        expect(user.id).toEqual(1);

        expect(users.users.length).toEqual(2);
    });

    it('should not remove a user', () => {
        var user = users.removeUser(5);

        expect(user).toNotExist();

        expect(users.users.length).toEqual(3);
    });
});