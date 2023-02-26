const jwt = require('jsonwebtoken');

class VerifyToken {
    verifyToken(req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.nickName = decoded.nickName;
            next();
        });
    }
}

module.exports = new VerifyToken();
