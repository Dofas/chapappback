const sinon = require('sinon');
const Team = require('../model/teamModal');
const teamController = require('./teamController');

describe('Team Controller tests', () => {
    let sandbox = sinon.createSandbox();
    let nextFunc = sinon.stub();
    beforeEach(function () {
        res = {
            json: sandbox.spy(),
            status: sandbox.stub().returns({ end: sinon.spy() }),
        };
    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
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
    it('should create team', async function () {
        jest.spyOn(Team, 'findOne').mockReturnValue(Promise.resolve(false));
        sandbox.stub(Team, 'create').yields(null, true);
        await teamController.create(req, res, nextFunc);
        sinon.assert.calledWith(Team.create, {
            ...req.body,
            id: req.body.name,
        });
    });

    it('should update team', async function () {
        jest.spyOn(Team, 'findOne').mockReturnValueOnce(Promise.resolve(true));
        sandbox.stub(Team, 'findOneAndUpdate');
        await teamController.update(req, res, nextFunc);
        sinon.assert.calledWith(Team.findOneAndUpdate, { name: req.body.name });
    });

    it('should delete team', async function () {
        expectedResult = { status: true };
        jest.spyOn(Team, 'findOne').mockReturnValueOnce(Promise.resolve(true));
        jest.spyOn(Team, 'findOne').mockReturnValueOnce(
            Promise.resolve([{ name: 'someName', users: { users: [] } }])
        );
        sandbox.stub(Team, 'findOneAndUpdate');
        sandbox.stub(Team, 'deleteOne');
        sinon.stub(Team, 'findOne').returns({
            select: (users) => {
                return new Promise((resolve, reject) => {
                    resolve({ users: [] });
                });
            },
        });
        await teamController.update(req, res, nextFunc);
        sinon.assert.calledWith(Team.findOneAndUpdate, { name: req.body.name });
        sinon.assert.calledWith(Team.deleteOne, { name: req.body.name });
        expect(res.json.args[0][0]).toEqual(expectedResult);
    });

    it('should get all teams', async function () {
        expectedResult = [{ users: ['user1'] }, { users: ['user2'] }];
        jest.spyOn(Team, 'find').mockReturnValue(
            Promise.resolve(expectedResult)
        );
        await teamController.getAll(req, res, nextFunc);
        expect(res.json.args[0][0]).toEqual(expectedResult);
    });
});
