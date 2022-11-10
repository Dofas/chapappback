const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
    {
        message: {
            text: {
                type: String,
                required: true,
            },
            sendTime: {
                type: String,
                required: true,
            },
            file: {
                type: String,
                required: false,
            },
        },
        users: Array,
        sender: {
            type: String,
            ref: 'User',
            required: true,
        },
        isRead: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Messages', messageSchema);
