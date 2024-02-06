const path = require('path');
const cors = require('cors');
const express = require('express');
const { createServer } = require('http');
const { Server } = require("socket.io");
const { socketEvents } = require("../client/src/socket/socketEvents");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {origin: ["http://localhost:3000", "http://192.168.0.105:3000"]}
});

const authController = require('./controllers/authController');
const verifyUser = require("./middlewares/verifyUser");

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post("/signup", authController.register);
app.post("/login", authController.login);
app.use(verifyUser).get("/autologin", authController.autoLogin);
app.get("/logout", authController.logout);

const PORT = process.env.PORT || 9000;

let users = [];
let messages = [];
let rooms = []
let timeoutId = null;

io.on("connection", (socket) => {
    console.log("New connection");
    clearTimeout(timeoutId);

    const disconnectingHandler = () => {
        users = users.filter(user => user.socketID !== socket.id); //Updates the list of users when a user disconnects from the server
        io.emit(socketEvents.user.disconnected, users);
    };


    socket.on(socketEvents.user.connecting, (newUser) => { //Listens when a new user joins the server
        const existingUser = users.find(user => user.id === newUser.id);

        if(existingUser) {
            users = users.map(user => {
                if(user.id === existingUser.id) {
                    return {
                        ...user,
                        socketID: socket.id
                    }
                }
                return user;
            }); //Updates the existing user in the list of users
        } else {
            users.push({
                ...newUser,
                socketID: socket.id
            }); //Adds the new user to the list of users
        }

        io.emit(socketEvents.user.connected, users); //Sends the list of users to the client
    });

    socket.on(socketEvents.message.sending, (messageData) => {
        console.log(messageData)
        messages.push(messageData);
        io.emit(socketEvents.message.sent, messages);
        socket.broadcast.emit('MESSAGE:NOTIFICATION');
    });

    socket.on(socketEvents.message.typing, (text) => {
        socket.broadcast.emit(socketEvents.message.typingResponse, text);
    });

    socket.on(socketEvents.room.joining, (userId) => {
        const existingUser = users.find(user => user.id === userId);
        if(!existingUser) return;

        const socketID = existingUser.socketID;
        const roomID = Date.now() + "";
        io.in(socketID).socketsJoin(roomID);
        socket.join(roomID);

        // const iterator = socket.rooms.values();

        // for (const entry of iterator) {
        //     rooms.push(entry);
        // }
        io.to(roomID).emit(socketEvents.room.joined, existingUser)
        

    });


    socket.on('disconnect', (reason) => {
        console.log("disconnect", reason);
        if(reason === "client namespace disconnect") {
            disconnectingHandler()
        } else {
            timeoutId = setTimeout(disconnectingHandler, 5000)
        }
    });
});

httpServer.listen(PORT, (err) => {
    if(err) {
        throw new Error(err)
    }
    console.log(`Listening on port ${PORT}`)
})