const Router = require('express');
const router = new Router();

const messageController = require('../controllers/messageController');
const verifyToken = require('../midleware/VerifyToken');

router.post('/all', messageController.getAll);
router.post(
    '/update/status',
    // verifyToken.verifyToken,
    messageController.updateReadStatus
);
router.post(
    '/unread',
    // verifyToken.verifyToken,
    messageController.getUnreadMessages
);
router.post('/last', messageController.getLast);
// router.post('/last', verifyToken.verifyToken, messageController.getLast);
router.post('/create', messageController.create);

module.exports = router;
