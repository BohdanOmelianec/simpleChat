const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app)
const io = require("socket.io")(http);

const path = require('path');

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));


const PORT = process.env.PORT || 9000;

let chat = new Map();
chat.set('users', new Map()).set('messages', [])

app.post('/auth', (req, res) => {
    const {userName} = req.body
    for(const user of chat.get('users').values()) {
        if(user === userName) {
            res.send(false)
            return;
        } 
    }
    res.send(true);
})

app.get('/messages', (req, res) => {
    const messages = chat.get('messages')
    res.send(messages);
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

io.on("connection", (socket) => {
    socket.on('USER:CONNECT', userName => {
        const newUser = {
            id: socket.id,
            userName
        }

        chat.get('users').set(socket.id, userName)
        const users = chat.get('users');
        socket.emit('USER:CONNECT', newUser)
        io.emit('USER:CONNECTED', [...users])
    })

    socket.on('USER:MESSAGE', (messageData) => {
        chat.get('messages').push(messageData)
        const newMessage = chat.get('messages')
        io.emit('USER:MESSAGE', newMessage)
        socket.broadcast.emit('MESSAGE:NOTIFICATION')
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)
        if(chat.get('users').delete(socket.id)) {
            const users = chat.get('users')
            io.emit('USER:DISCONNECTED', [...users])
        }
    })

   
});

http.listen(PORT, (err) => {
    if(err) {
        throw new Error(err)
    }
    console.log(`Listening on port ${PORT}`)
})