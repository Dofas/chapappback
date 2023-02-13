const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        nickName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        dateOfBirthday: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        languages: {
            type: [String],
            required: true,
        },
        avatar: {
            type: String,
            required: true,
            default: '',
        },
        status: {
            type: String,
            required: true,
        },
        // refresh_token: {
        //     type: String,
        // },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
