const express = require('express');
const socketio = require("socket.io");
const http = require('http');
const cors = require('cors');

// index에서 모든 유저 관리 가능하도록 
const { addUser, removeUser, getUser , getUserInRoom} = require('./users.js'); 

const PORT = process.env.NODE_ENV || 5000;

const router = require('./router');

const app = express();

const server = http.createServer(app);
const io = socketio(server);
// basic socketio server working

app.use(router);
app.use(cors());
//resource sharing

// Notice that I initialize a new instance of socket.io by passing the http (the HTTP server) object. 
//Then I listen on the connection event for incoming sockets, and I log it to the console.


io.on('connection', (socket)=> {
    // console.log('We have a new Connection!!!');

    // client => server receive event
    // callback function 
    socket.on('join',({name,room},callback) =>{
        // console.log(name,room);

        //addUser에 정의 된 두가지 property
        const { error, user} = addUser({ id:socket.id, name, room}); 
        //socket id , name, room

    if(error) return callback(error);

        // doing error handling
        // const error = true;
        // if(error) {
        //     callback({error:'error'});
        // }
    
     //event emit ----> admin 
     socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}.`});
     
     //특젇사용자 x 채팅방내의 모든 사용자 user.name에 해당 하는 사용자 이외 사람들에게 보냄
     socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    // 에러가 아니라면 socket으로 join
     socket.join(user.room);  

    //user existing
    io.to(user.room).emit('roomData', {room: user.room, users:getUserInRoom(user.room)})

    
     callback();

    });

    // message
    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users:getUserInRoom(user.room) });
        callback();
    });

    socket.on('disconnect', () => {
        // console.log('User had left!!!');
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',{user:'admin', text: `${user.name} has left`});
        }
    });
})



server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));