const ApiError = require('../error/ApiError');
const User = require('../model/userModal');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const path = require('path');
const jwt = require('jsonwebtoken');
const userHelpers = require('../helpers/UserHelpers');

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

            const userToCreate = {
                id: nickName,
                firstName,
                lastName,
                location,
                nickName,
                email,
                number,
                dateOfBirthday,
                gender,
                languages: languages,
                avatar: fileName,
                status: 'online',
            };

            const accessToken = jwt.sign(
                { nickName },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '45s' }
            );
            const refreshToken = jwt.sign(
                { nickName },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 1000,
            });

            await User.create({
                ...userToCreate,
                password: hashedPassword,
                refresh_token: refreshToken,
            });
            return res.json({ status: true, accessToken });
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
            const userNameCheck = await User.findOne({ nickName });
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

            const accessToken = jwt.sign(
                { nickName },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '45s' }
            );
            const refreshToken = jwt.sign(
                { nickName },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            await User.findOneAndUpdate(
                { nickName },
                { status: 'online', refresh_token: refreshToken }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 1000,
            });

            return res.json({ status: true, accessToken });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.sendStatus(204);
            const userNameCheck = await User.findOne({
                refresh_token: refreshToken,
            });
            if (!userNameCheck) return res.sendStatus(204);
            await User.findOneAndUpdate(
                { refresh_token: refreshToken },
                { status: 'offline', refresh_token: null }
            );
            res.clearCookie('refreshToken');
            return res.sendStatus(200);
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
                const userWithoutPassword =
                    userHelpers.createUserWithoutPassword(user);
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
