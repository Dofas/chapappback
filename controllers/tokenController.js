const ApiError = require('../error/ApiError');
const User = require('../model/userModal');
const jwt = require('jsonwebtoken');
const userHelpers = require('../helpers/UserHelpers');

class TokenController {
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            console.log('refreshToken', refreshToken);
            if (!refreshToken) return res.sendStatus(401);

            const user = await User.find({ refresh_token: refreshToken });
            if (!user[0]) return res.sendStatus(403);

            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err) => {
                    if (err) return res.sendStatus(403);
                    const userToReturn = userHelpers.createUserWithoutPassword(
                        user[0]
                    );
                    const accessToken = jwt.sign(
                        { nickName: userToReturn.nickName },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: '15s',
                        }
                    );
                    res.json({ status: true, accessToken });
                }
            );
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new TokenController();
