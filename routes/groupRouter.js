const Router = require('express');
const router = new Router();

const groupController = require('../controllers/groupController');
const verifyToken = require('../midleware/VerifyToken');

router.get('/all/:user', verifyToken.verifyToken, groupController.getAll);
router.post('/create', verifyToken.verifyToken, groupController.create);
router.put('/update/:name', verifyToken.verifyToken, groupController.update);

module.exports = router;
