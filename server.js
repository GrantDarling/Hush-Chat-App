const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`${id} connected`);

  io.emit('connection', id);

  socket.on('disconnect', () => {
    console.log(`${id} disconnected`);
  });

  socket.on('chat message', (message) => {
    console.log(`Message: ${message}, ID: ${socket.client.id}`);
    const id = socket.client.id;
    io.emit('chat message', message, id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
