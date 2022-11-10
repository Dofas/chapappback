const ApiError = require('../error/ApiError');
const Group = require('../model/groupModal');

class GroupController {
    async create(req, res, next) {
        try {
            const { name, users } = req.body;
            const groupCheck = await Group.findOne({ name });
            if (groupCheck) {
                return next(ApiError.badRequest('Group already exists'));
            }
            await Group.create({
                id: name,
                name,
                users,
            });
            return res.json({ status: true });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { users } = req.body;
            const name = req.params.name;
            const groupCheck = await Group.findOne({ name });
            if (!groupCheck) {
                return next(ApiError.badRequest('Group doesnt exists'));
            }
            await Group.findOneAndUpdate({ name }, { users });
            return res.json({ status: true });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const user = req.params.user;
            const groups = await Group.find({ users: user });
            return res.json(groups);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new GroupController();
