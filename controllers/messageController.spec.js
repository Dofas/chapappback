const sinon = require('sinon');
const Message = require('../model/messageModal');
const messageController = require('./messageController');

jest.mock('uuid', () => ({ v4: () => '123456789' }));

describe('Message Controller tests', () => {
    let res;
    let expectedResult;
    let sandbox = sinon.createSandbox();
    let nextFunc = sinon.stub();
    beforeEach(function () {
        res = {
            json: sandbox.spy(),
            status: sandbox.stub().returns({ end: sinon.spy() }),
        };
    });
    let req = {
        body: {
            from: 'from',
            to: 'to',
            text: 'text',
            sendTime: '20:20am',
            isRead: false,
        },
        params: {
            name: 'Group',
            user: 'User',
        },
        files: {
            avatar: { name: 'emptyFile.txt' },
        },
    };
    it('should create message', async function () {
        expectedResult = {
            id: '123456789',
            sender: req.body.from,
            isRead: req.body.isRead,
            users: [req.body.from, req.body.to],
            message: {
                text: req.body.text,
                sendTime: req.body.sendTime,
                file: null,
            },
        };
        sandbox.stub(Message, 'create').yields();
        await messageController.create(req, res, nextFunc);
        sinon.assert.calledWith(Message.create, expectedResult);
    });

    it('should update read status', async function () {
        expectedResult = { status: true };
        jest.spyOn(Message, 'find').mockReturnValue(
            Promise.resolve([{ _id: 'id1' }, { _id: 'id2' }])
        );
        sandbox.stub(Message, 'findOneAndUpdate');
        await messageController.updateReadStatus(req, res, nextFunc);
        sinon.assert.calledTwice(Message.findOneAndUpdate);
        sinon.assert.calledWith(Message.findOneAndUpdate, {
            _id: 'id1',
        });
        sinon.assert.calledWith(Message.findOneAndUpdate, {
            _id: 'id2',
        });
        expect(res.json.args[0][0]).toEqual(expectedResult);
    });

    it('should get unread messages', async function () {
        expectedResult = {
            status: true,
            messagesCount: 2,
            messages: [{ _id: 'id1' }, { _id: 'id2' }],
            id: req.body.to,
        };
        jest.spyOn(Message, 'find').mockReturnValue(
            Promise.resolve([{ _id: 'id1' }, { _id: 'id2' }])
        );
        await messageController.getUnreadMessages(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual(expectedResult);
    });

    it('should get all messages', async function () {
        expectedResult = [{ _id: 'id1' }, { _id: 'id2' }];
        jest.spyOn(Message, 'find').mockReturnValue(
            Promise.resolve(expectedResult)
        );
        await messageController.getAll(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual(expectedResult);
    });

    it('should get last message', async function () {
        expectedResult = [{ _id: 'id2', createdAt: 3 }];
        jest.spyOn(Message, 'find').mockReturnValue(
            Promise.resolve([
                { _id: 'id1', createdAt: '2022-11-01T19:12:19.430Z,' },
                { _id: 'id2', createdAt: '2022-11-01T19:12:19.430Z' },
            ])
        );
        await messageController.getLast(req, res, nextFunc);
    });
});
