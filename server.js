const express = require('express');
const app = express();
const socketAPI = require('./socketAPI');
const server = require('http').Server(app);
const io = require("socket.io")(server, { cors: 
  { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});


io.on("connection", (socket) => {
  
  socketAPI.connected(socket);

  socket.on('disconnect', () => socketAPI.disconnect(socket));

  socket.on('create room', (emittedRoom, emittedHost, emittedAllowVideo ) => 
    socketAPI.createRoom(socket, emittedRoom, emittedHost, emittedAllowVideo));

  socket.on('join room', (emittedRoom) => socketAPI.joinRoom(socket, emittedRoom));

  socket.on('leave all rooms', () => socketAPI.leaveAllRooms(socket));

  socket.on('refesh clients', (emittedRoom, guestState) => socketAPI.refreshClients(socket, emittedRoom, guestState));

  socket.on('chat message', (message, emittedRoom, sender, messageClass, audio) => 
    socketAPI.sendChatMessage(socket, sender, message, emittedRoom, messageClass, audio));

  socket.on('get rooms', () => socketAPI.getRooms(socket));

  socket.on('close room', (emittedRoom) => socketAPI.closeRoom(socket, emittedRoom));

});

// Start server
app.get('/', (res, req) => {
  req.send('Hush App Server...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
