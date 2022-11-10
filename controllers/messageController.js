const ApiError = require('../error/ApiError');
const Message = require('../model/messageModal');
const uuid = require('uuid');
const path = require('path');

class MessageController {
    async create(req, res, next) {
        try {
            const { from, to, text, sendTime, isRead } = req.body;
            const { avatar } = req.files;
            if (!from || !to || !text || !sendTime) {
                return next(ApiError.badRequest('Invalid request'));
            }
            let fileName = null;
            if (avatar.name !== 'emptyFile.txt') {
                fileName = uuid.v4() + '.' + avatar.mimetype.split('/')[1];
                await avatar.mv(
                    path.resolve(__dirname, '..', 'static', fileName)
                );
            }
            await Message.create({
                id: uuid.v4(),
                users: [from, to],
                sender: from,
                message: {
                    text: text,
                    sendTime: sendTime,
                    file: fileName,
                },
                isRead,
            });
            return res.json({ status: true, fileName });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async updateReadStatus(req, res, next) {
        try {
            const { from, to } = req.body;

            const messages = await Message.find({
                users: {
                    $all: [from, to],
                },
                sender: to,
            });
            for (let message of messages) {
                await Message.findByIdAndUpdate(message._id, { isRead: true });
            }
            return res.json({ status: true });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getUnreadMessages(req, res, next) {
        try {
            const { from, to } = req.body;

            const unreadMessages = await Message.find({
                users: {
                    $all: [from, to],
                },
                sender: to,
                isRead: false,
            });
            return res.json({
                status: true,
                messagesCount:
                    unreadMessages && unreadMessages.length > 0
                        ? unreadMessages.length
                        : undefined,
                messages: unreadMessages,
                id: to,
            });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const { from, to } = req.body;
            const messages = await Message.find({
                users: {
                    $all: [from, to],
                },
            });
            return res.json(messages);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getLast(req, res, next) {
        try {
            const { from, to } = req.body;
            const messages = await Message.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ createdAt: 1 });
            return res.json(messages.at(-1));
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new MessageController();
