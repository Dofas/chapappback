const Router = require('express');
const router = new Router();

const messageController = require('../controllers/messageController');
const verifyToken = require('../midleware/VerifyToken');

router.post('/all', verifyToken.verifyToken, messageController.getAll);
router.post(
    '/update/status',
    verifyToken.verifyToken,
    messageController.updateReadStatus
);
router.post(
    '/unread',
    verifyToken.verifyToken,
    messageController.getUnreadMessages
);
router.post('/last', verifyToken.verifyToken, messageController.getLast);
router.post('/create', verifyToken.verifyToken, messageController.create);

module.exports = router;
