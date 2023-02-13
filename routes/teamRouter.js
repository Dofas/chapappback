const Router = require('express');
const router = new Router();

const teamController = require('../controllers/teamController');
const verifyToken = require('../midleware/VerifyToken');

router.get('/all/:user', teamController.getAll);
router.post('/create', teamController.create);
router.put('/update/:name', teamController.update);

module.exports = router;
