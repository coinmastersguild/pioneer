const io = require("socket.io-client");
const { parse } = require("cookie"); // Import the parse function from the 'cookie' package

const socket = io("wss://pioneers.dev");
// const socket = io("ws://127.0.0.1:9001");
// const socket = io("wss://deployfast.co", {
//     transports: ['websocket'],  // This will disable long polling and use only WebSocket
// });

// Object to store cookies
const storedCookies = {};

// Parse and store cookies from response headers
const storeCookies = cookieHeaderArray => {
    for (const cookieHeader of cookieHeaderArray) {
        console.log("cookieHeader: ", cookieHeader);
        const cookies = parse(cookieHeader || '');

        // Assign cookies to the storedCookies object
        Object.assign(storedCookies, cookies);
    }
};

socket.on("connect", () => {
    console.log("connected to server");
});

socket.on("message", msg => {
    console.log("received message:", msg);
});

socket.on("disconnect", () => {
    console.log("disconnected from server");
});

// Intercept the 'set-cookie' response header and store cookies
socket.io.engine.transport.on("pollComplete", () => {
    const request = socket.io.engine.transport.pollXhr.xhr;
    const cookieHeader = request.getResponseHeader("set-cookie");
    if (cookieHeader) {
        storeCookies(cookieHeader);
    }
});

// Modify the request headers to include stored cookies
socket.io.engine.transport.on("upgrade", req => {
    let storedCookies = ['example']
    const cookies = Object.entries(storedCookies)
        .map(([name, value]) => `${name}=${value}`)
        .join("; ");
    req.setRequestHeader("Cookie", cookies);
});

const sendMessage = msg => {
    socket.send(msg);
};
