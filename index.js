const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const errorHandler = require('./midleware/ErrorHandlingMiddleware');
const router = require('./routes/index');
const socket = require('socket.io');
const axios = require('axios');

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

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

let onlineUsers = [];

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.push({ [userId]: socket.id });
    });

    socket.on('send-msg', (data) => {
        const sendUserSockets = onlineUsers
            .filter((user) => {
                return user[data.to] || user[data.from];
            })
            .filter((newUser) => newUser !== undefined);
        if (sendUserSockets.length) {
            sendUserSockets.forEach((sendUserSocket) => {
                const userSocket = Object.values(sendUserSocket)[0];
                socket.to(userSocket).emit('msg-receive', data);
            });
        }
    });

    socket.on('register-user', (data) => {
        io.sockets.emit('upd-register-users', data);
    });

    socket.on('add-team', (data) => {
        const usersSocket = data[0].users.flatMap((user) =>
            onlineUsers
                .filter((onlineUser) => onlineUser[user] && user)
                .filter((users) => users !== undefined)
        );
        if (usersSocket.length) {
            usersSocket.forEach((sendUserSocket) => {
                const userSocket = Object.values(sendUserSocket)[0];
                socket.to(userSocket).emit('upd-team', data);
            });
        }
    });

    socket.on('add-group', (data) => {
        const usersSocket = data[0].users.flatMap((user) =>
            onlineUsers
                .filter((onlineUser) => onlineUser[user] && user)
                .filter((users) => users !== undefined)
        );
        if (usersSocket.length) {
            usersSocket.forEach((sendUserSocket) => {
                const userSocket = Object.values(sendUserSocket)[0];
                socket.to(userSocket).emit('upd-group', data);
            });
        }
    });

    socket.on('delete-team-user', (data) => {
        io.sockets.emit('upd-team-user', data);
    });

    socket.on('change-status', async (data) => {
        if (data.status === 'offline') {
            const allIndexes = onlineUsers.reduce(
                (accumulator, currentValue, arrayIndex) => {
                    if (Object.keys(currentValue)[0] === data.nickName) {
                        accumulator.push(arrayIndex);
                    }
                    return accumulator;
                },
                []
            );
            if (allIndexes?.length) {
                onlineUsers.splice(allIndexes[0], 1);
            }
            const isUserStillActive = onlineUsers.findIndex(
                (onlineUser) => Object.keys(onlineUser)[0] === data.nickName
            );
            if (isUserStillActive < 0) {
                await axios.post(
                    `http://localhost:${PORT}/api/user/status/update/${data.nickName}`,
                    data
                );

                io.sockets.emit('upd-status', data);
            }
        }
        if (data.status === 'online') {
            io.sockets.emit('upd-status', data);
        }
    });

    socket.on('disconnect', async () => {
        const allIndexes = onlineUsers.reduce(
            (accumulator, currentValue, arrayIndex) => {
                if (Object.values(currentValue)[0] === socket.id) {
                    accumulator.push(arrayIndex);
                }
                return accumulator;
            },
            []
        );
        const data = {
            nickName:
                onlineUsers[allIndexes[0]] &&
                Object.keys(onlineUsers[allIndexes[0]])[0],
            status: allIndexes?.length < 2 ? 'offline' : 'online',
        };
        if (allIndexes?.length) {
            onlineUsers.splice(allIndexes[0], 1);
        }
        const isUserStillActive = onlineUsers.findIndex(
            (onlineUser) => Object.keys(onlineUser)[0] === data.nickName
        );
        if (isUserStillActive < 0 && data?.nickName) {
            await axios
                .post(
                    `http://localhost:${PORT}/api/user/status/update/${data.nickName}`,
                    data
                )
                .catch((e) => console.log(e.message));
            io.sockets.emit('upd-status', data);
        }
    });
});
