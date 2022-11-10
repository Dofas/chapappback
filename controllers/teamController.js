const ApiError = require('../error/ApiError');
const Team = require('../model/teamModal');

class TeamController {
    async create(req, res, next) {
        try {
            const { name, users } = req.body;
            const teamCheck = await Team.findOne({ name });
            if (teamCheck) {
                return next(ApiError.badRequest('Team already exists'));
            }
            await Team.create({
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
            const teamCheck = await Team.findOne({ name });
            if (!teamCheck) {
                return next(ApiError.badRequest('Team doesnt exists'));
            }
            await Team.findOneAndUpdate({ name }, { users });
            Team.findOne({ name })
                .select({ users })
                .then(async (users) => {
                    if (users.users.length === 0) {
                        await Team.deleteOne({ name });
                    }
                })
                .catch((error) => next(ApiError.internal(error.message)));
            return res.json({ status: true });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const user = req.params.user;
            const teams = await Team.find({ users: user });
            return res.json(teams);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new TeamController();
