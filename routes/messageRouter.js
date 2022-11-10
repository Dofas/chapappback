const Router = require('express');
const router = new Router();

const messageController = require('../controllers/messageController');

router.post('/all', messageController.getAll);
router.post('/update/status', messageController.updateReadStatus);
router.post('/unread', messageController.getUnreadMessages);
router.post('/last', messageController.getLast);
router.post('/create', messageController.create);

module.exports = router;
