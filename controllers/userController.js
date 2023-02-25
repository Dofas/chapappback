const ApiError = require('../error/ApiError');
const User = require('../model/userModal');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const path = require('path');

class UserController {
    async registration(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                location,
                nickName,
                email,
                number,
                dateOfBirthday,
                password,
                gender,
                languages,
            } = req.body;
            const { avatar } = req.files;
            const userNameCheck = await User.findOne({ nickName });
            if (userNameCheck) {
                return next(ApiError.badRequest('User already exists'));
            }
            let fileName = uuid.v4() + '.' + avatar.mimetype.split('/')[1];
            await avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                id: nickName,
                firstName,
                lastName,
                location,
                nickName,
                email,
                number,
                dateOfBirthday,
                password: hashedPassword,
                gender,
                languages: languages,
                avatar: fileName,
                status: 'online',
            });
            return res.json({ status: true });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { nickName, password } = req.body;
            if (!nickName || !password) {
                return next(
                    ApiError.badRequest('Incorrect username or password')
                );
            }
            const userNameCheck = await User.findOneAndUpdate(
                { nickName },
                { status: 'online' }
            );
            if (!userNameCheck) {
                return next(ApiError.badRequest('User doesnt exist'));
            }
            const isPasswordCorrect = await bcrypt.compare(
                password,
                userNameCheck.password
            );
            if (!isPasswordCorrect) {
                return next(ApiError.badRequest('Incorrect password'));
            }
            return res.json({ status: true });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    async check(req, res, next) {
        try {
            const nickName = req.params.nickName;
            const user = await User.findOne({ nickName });
            if (!user) {
                return res.json({ status: false });
            }
            user.password = undefined;
            return res.json(user);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.find();
            if (!users) {
                return res.json({ status: false });
            }
            let usersWithoutPassword = [];
            for (let user of users) {
                const userWithoutPassword = {
                    avatar: user.avatar,
                    dateOfBirthday: user.dateOfBirthday,
                    email: user.email,
                    firstName: user.firstName,
                    gender: user.gender,
                    id: user.id,
                    languages: user.languages,
                    lastName: user.lastName,
                    location: user.location,
                    nickName: user.nickName,
                    number: user.number,
                    status: user.status,
                };
                usersWithoutPassword.push(userWithoutPassword);
            }
            return res.json(usersWithoutPassword);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getStatus(req, res, next) {
        try {
            const nickName = req.params.nickName;
            if (!nickName) {
                return next(ApiError.badRequest('Incorrect username'));
            }
            const userNameCheck = await User.findOne({ nickName });
            if (!userNameCheck) {
                return next(ApiError.badRequest('User doesnt exist'));
            }
            return res.json({ status: userNameCheck.status });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const nickName = req.params.nickName;
            const { status } = req.body;
            if (!nickName || !status) {
                return next(
                    ApiError.badRequest('Incorrect username or status')
                );
            }
            const userNameCheck = await User.findOneAndUpdate(
                { nickName },
                { status }
            );
            if (!userNameCheck) {
                return next(ApiError.badRequest('User doesnt exist'));
            }
            return res.json({ status: true });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new UserController();
