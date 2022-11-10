const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const errorHandler = require('./midleware/ErrorHandlingMiddleware');
const router = require('./routes/index');
const socket = require('socket.io');

const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(errorHandler);
app.use('/api', router);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Working!' });
});

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Mongo started');
    })
    .catch((error) => {
        console.log(`Mongo failed ${error.message}`);
    });

server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
});
global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data);
        }
    });

    socket.on('register-user', (data) => {
        io.sockets.emit('upd-register-users', data);
    });

    socket.on('add-team', (data) => {
        const usersSocket = data[0].users.map((user) => onlineUsers.get(user));
        usersSocket.forEach((userSocket) => {
            if (userSocket) {
                socket.to(userSocket).emit('upd-team', data);
            }
        });
    });

    socket.on('add-group', (data) => {
        const usersSocket = data[0].users.map((user) => onlineUsers.get(user));
        usersSocket.forEach((userSocket) => {
            if (userSocket) {
                socket.to(userSocket).emit('upd-group', data);
            }
        });
    });

    socket.on('delete-team-user', (data) => {
        io.sockets.emit('upd-team-user', data);
    });

    socket.on('change-status', (data) => {
        if (data.status === 'offline') {
            onlineUsers.delete(data.nickName);
        }
        io.sockets.emit('upd-status', data);
    });
});
