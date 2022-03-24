import io from "socket.io-client";

// const socket = io.connect('http://192.168.1.214:9000', {'transports': ['polling']});
const socket = io();

export default socket;