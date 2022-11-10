const Router = require('express');
const router = new Router();

const groupController = require('../controllers/groupController');

router.get('/all/:user', groupController.getAll);
router.post('/create', groupController.create);
router.put('/update/:name', groupController.update);

module.exports = router;
