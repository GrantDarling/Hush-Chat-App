const express = require('express');
const app = express();
const socketAPI = require('./socketAPI');
const server = require('http').Server(app);
const io = require("socket.io")(server, { cors: 
  { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

let broadcaster;

io.sockets.on("error", e => console.log(e));

io.on("connection", (socket) => {

  socket.on('joinedz', () => {
    socket.emit("joinedz");
  });
  // webRTC Sockets
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });


  // Duplicates
    socket.on("broadcaster2", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster2");
  });
  socket.on("watcher2", () => {
    socket.to(broadcaster).emit("watcher2", socket.id);
  });
  socket.on("offer2", (id, message) => {
    socket.to(id).emit("offer2", socket.id, message);
  });
  socket.on("answer2", (id, message) => {
    socket.to(id).emit("answer2", socket.id, message);
  });
  socket.on("candidate2", (id, message) => {
    socket.to(id).emit("candidate2", socket.id, message);
  });
  socket.on("disconnect2", () => {
    socket.to(broadcaster).emit("disconnectPeer2", socket.id);
  });

  
    // Chat Sockets
  socketAPI.connected(socket);

  socket.on('disconnect', () => {
    socketAPI.disconnect(socket);
  });

  socket.on('create room', (emittedRoom, emittedHost, emittedAllowVideo ) => 
    socketAPI.createRoom(socket, emittedRoom, emittedHost, emittedAllowVideo));

  socket.on('join room', (emittedRoom) => 
    socketAPI.joinRoom(socket, emittedRoom));

  socket.on('leave all rooms', () => 
    socketAPI.leaveAllRooms(socket));

  socket.on('refesh clients', (emittedRoom, guestState) => 
    socketAPI.refreshClients(socket, emittedRoom, guestState));

  socket.on('chat message', (message, emittedRoom, sender, messageClass, audio) => 
    socketAPI.sendChatMessage(socket, sender, message, emittedRoom, messageClass, audio));

  socket.on('get rooms', () => 
    socketAPI.getRooms(socket));

  socket.on('close room', (emittedRoom) => 
    socketAPI.closeRoom(socket, emittedRoom));
});

// Start server
app.get('/', (res, req) => {
  req.send('Hush App Server...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
