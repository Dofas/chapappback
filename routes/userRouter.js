const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');
// const verifyToken = require('../midleware/VerifyToken');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// router.get('/all', verifyToken.verifyToken, userController.getAll);
router.get('/all', userController.getAll);
router.get('/check/:nickName', userController.check);
router.get('/status/:nickName', userController.getStatus);
router.post('/status/update/:nickName', userController.updateStatus);

module.exports = router;
