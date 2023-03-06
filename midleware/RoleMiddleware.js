const jwt = require('jwt-decode');

module.exports = (usersRoles) => {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt(token);

        if (!usersRoles.some((userRole) => userRole === decoded.role)) {
            return res
                .status(403)
                .json({ message: 'User does not have required permissions' });
        }

        next();
    };
};
