const Router = require('express');
const router = new Router();

const teamController = require('../controllers/teamController');
const verifyToken = require('../midleware/VerifyToken');

router.get('/all/:user', verifyToken.verifyToken, teamController.getAll);
router.post('/create', verifyToken.verifyToken, teamController.create);
router.put('/update/:name', verifyToken.verifyToken, teamController.update);

module.exports = router;
