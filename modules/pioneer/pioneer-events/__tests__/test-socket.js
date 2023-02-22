
const io = require("socket.io-client");

// const socket = io("wss://pioneers.dev");
const socket = io("ws://127.0.0.1:9001");

socket.on("connect", () => {
    console.log("connected to server");
});

socket.on("message", msg => {
    console.log("received message:", msg);
});

socket.on("disconnect", () => {
    console.log("disconnected from server");
});

const sendMessage = msg => {
    socket.send(msg);
};