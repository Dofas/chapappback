const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const teamRouter = require('./teamRouter');
const groupRouter = require('./groupRouter');
const messageRouter = require('./messageRouter');

router.use('/user', userRouter);
router.use('/team', teamRouter);
router.use('/group', groupRouter);
router.use('/message', messageRouter);

module.exports = router;
