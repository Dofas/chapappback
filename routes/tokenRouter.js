const Router = require('express');
const router = new Router();

const tokenController = require('../controllers/tokenController');

router.get('/refresh', tokenController.refreshToken);

module.exports = router;
