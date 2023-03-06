const Router = require('express');
const router = new Router();

const teamController = require('../controllers/teamController');
const verifyToken = require('../midleware/VerifyToken');
const roleMiddleware = require('../midleware/RoleMiddleware');

router.get('/all/:user', verifyToken.verifyToken, teamController.getAll);
router.post(
    '/create',
    [verifyToken.verifyToken, roleMiddleware(['Manager'])],
    teamController.create
);
router.put(
    '/update/:name',
    [verifyToken.verifyToken, roleMiddleware(['Manager'])],
    teamController.update
);

module.exports = router;
