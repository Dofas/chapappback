const sinon = require('sinon');
const Group = require('../model/groupModal');
const groupController = require('./groupController');

describe('Group Controller tests', () => {
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
                name: 'Group',
                users: ['First', 'Second'],
            },
            params: {
                name: 'Group',
                user: 'User',
            },
        },
        res = {},
        expectedResult;
    it('should create group', async function () {
        expectedResult = {
            ...req.body,
            id: req.body.name,
        };
        jest.spyOn(Group, 'findOne').mockReturnValue(Promise.resolve(false));
        sandbox.stub(Group, 'create').yields(null, true);
        await groupController.create(req, res, nextFunc);
        sinon.assert.calledWith(Group.create, expectedResult);
    });

    it('should update group', async function () {
        expectedResult = {
            name: req.body.name,
        };
        jest.spyOn(Group, 'findOne').mockReturnValue(Promise.resolve(true));
        sandbox.stub(Group, 'findOneAndUpdate');
        await groupController.update(req, res, nextFunc);
        sinon.assert.calledWith(Group.findOneAndUpdate, expectedResult);
    });

    it('should get all groups', async function () {
        expectedResult = {
            users: req.params.user,
        };
        sandbox.stub(Group, 'find');
        await groupController.getAll(req, res, nextFunc);
        sinon.assert.calledWith(Group.find, expectedResult);
    });
});
