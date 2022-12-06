const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
const { info } = require('console')



const app = express();
const server = http.createServer(app);
const io = socketio(server);


//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//run when user connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        //for only user
        socket.emit('message', formatMessage('Chat-Box Bot', `Welcome ${user.username} to ChatBox`));
        //for all excepts user
        socket.broadcast.to(user.room).emit('message', formatMessage('Chat-Box Bot', `${user.username} has joined the chat`));

        //send room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })






    //liste for chatmsg
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg));
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {

            io.to(user.room).emit('message', formatMessage('Chat-Box Bot', `${user.username} has left the chat`));

            //send room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }


    });
})


server.listen(3000, () => {
    console.log('connected to port 3000');
})