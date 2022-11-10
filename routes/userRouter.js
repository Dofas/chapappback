const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/all', userController.getAll);
router.get('/check/:nickName', userController.check);
router.get('/status/:nickName', userController.getStatus);
router.post('/status/update/:nickName', userController.updateStatus);

module.exports = router;
