const sinon = require('sinon');
const User = require('../model/userModal');
const userController = require('./userController');
const bcrypt = require('bcrypt');

jest.mock('uuid', () => ({ v4: () => '123456789' }));

describe('User Controller tests', () => {
    let sandbox = sinon.createSandbox();
    let nextFunc = sinon.stub();
    let res;
    beforeEach(function () {
        res = {
            json: sandbox.spy(),
            status: sandbox.stub().returns({ end: sinon.spy() }),
        };
        sinon
            .stub(bcrypt, 'compare')
            .returns((value1, value2) => value1 === value2);
        sinon.stub(bcrypt, 'hash').returns('superPass');
    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('should login user', async function () {
        let req = {
            body: {
                dateOfBirthday: 'dateOfBirthday1',
                email: 'email1',
                firstName: 'firstName1',
                gender: 'gender1',
                id: 'id1',
                languages: '{"firstLang":"lang1"}',
                lastName: 'lastName1',
                location: 'location1',
                nickName: 'nickName1',
                number: 'number1',
                status: 'status1',
                password: '123',
            },
            params: {
                nickName: 'nickName1',
            },
            files: {
                avatar: {
                    mimetype: 'ext/png',
                    mv: (anyValue) => true,
                },
            },
        };
        jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(false));
        sandbox.stub(User, 'create');
        await userController.registration(req, res, nextFunc);
        sinon.assert.calledWith(User.create, {
            id: req.body.nickName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            location: req.body.location,
            nickName: req.body.nickName,
            email: req.body.email,
            number: req.body.number,
            dateOfBirthday: req.body.dateOfBirthday,
            password: 'superPass',
            gender: req.body.gender,
            languages: JSON.parse(req.body.languages),
            avatar: '123456789.png',
            status: 'online',
        });

        expect(res.json.args[0][0]).toEqual({ status: true });
    });

    it('should login user', async function () {
        const userResponseMock = [
            {
                avatar: 'avatar1',
                dateOfBirthday: 'dateOfBirthday1',
                email: 'email1',
                firstName: 'firstName1',
                gender: 'gender1',
                id: 'id1',
                languages: ['languages1'],
                lastName: 'lastName1',
                location: 'location1',
                nickName: 'nickName1',
                number: 'number1',
                status: 'status1',
                password: '123',
            },
        ];
        let req = {
            body: {
                status: 'status',
                password: '123',
                nickName: 'nickName1',
            },
            params: {
                nickName: 'nickName1',
            },
        };
        jest.spyOn(User, 'findOneAndUpdate').mockReturnValue(
            Promise.resolve(userResponseMock)
        );
        await userController.login(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual({ status: true });
    });

    it('should return user', async function () {
        const userResponseMock = [
            {
                avatar: 'avatar1',
                dateOfBirthday: 'dateOfBirthday1',
                email: 'email1',
                firstName: 'firstName1',
                gender: 'gender1',
                id: 'id1',
                languages: ['languages1'],
                lastName: 'lastName1',
                location: 'location1',
                nickName: 'nickName1',
                number: 'number1',
                status: 'status1',
                password: undefined,
            },
        ];
        let req = {
            body: {
                status: 'status',
            },
            params: {
                nickName: 'nickName',
            },
        };
        jest.spyOn(User, 'findOne').mockReturnValue(
            Promise.resolve(userResponseMock)
        );
        await userController.check(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual(userResponseMock);
    });

    it('should return all users', async function () {
        const usersResponseMock = [
            {
                avatar: 'avatar1',
                dateOfBirthday: 'dateOfBirthday1',
                email: 'email1',
                firstName: 'firstName1',
                gender: 'gender1',
                id: 'id1',
                languages: ['languages1'],
                lastName: 'lastName1',
                location: 'location1',
                nickName: 'nickName1',
                number: 'number1',
                status: 'status1',
            },
            {
                avatar: 'avatar2',
                dateOfBirthday: 'dateOfBirthday2',
                email: 'email2',
                firstName: 'firstName2',
                gender: 'gender2',
                id: 'id2',
                languages: ['languages2'],
                lastName: 'lastName2',
                location: 'location2',
                nickName: 'nickName2',
                number: 'number2',
                status: 'status2',
            },
        ];
        let req = {
            body: {
                status: 'status',
            },
            params: {
                nickName: 'nickName',
            },
        };
        jest.spyOn(User, 'find').mockReturnValue(
            Promise.resolve(usersResponseMock)
        );
        await userController.getAll(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual(usersResponseMock);
    });

    it('should update status', async function () {
        let req = {
            body: {
                status: 'status',
            },
            params: {
                nickName: 'nickName',
            },
        };
        jest.spyOn(User, 'findOneAndUpdate').mockReturnValue(
            Promise.resolve(true)
        );
        sandbox.stub(User, 'findOneAndUpdate');
        await userController.updateStatus(req, res, nextFunc);
        sinon.assert.calledWith(User.findOneAndUpdate, {
            nickName: req.params.nickName,
        });
    });

    it('should return status', async function () {
        let req = {
            body: {
                status: 'status',
            },
            params: {
                nickName: 'nickName',
            },
        };
        const expectedResult = { status: true };
        jest.spyOn(User, 'findOne').mockReturnValueOnce(
            Promise.resolve({ status: true })
        );
        await userController.getStatus(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual(expectedResult);
    });
});
