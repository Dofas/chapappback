const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        users: {
            type: [String],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Groups', groupSchema);
