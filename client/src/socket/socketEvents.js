const socketEvents = {
    getInitData: "GET_DATA",
    user: {
        connecting: "USER:CONNECTING",
        connected: "USER:CONNECTED",
        disconnecting: "USER:DISCONNECTING",
        disconnected: "USER:DISCONNECTED",
    },
    message: {
        sending: "MESSAGE:SENDING",
        sent: "MESSAGE:SENT",
        typing: "MESSAGE:TYPING",
        typingResponse: "MESSAGE:TYPING_RESPONSE"

    },
    room: {
        joining: "ROOM:JOINING",
        joined: "ROOM:JOINED",
    }
};

module.exports = {socketEvents};