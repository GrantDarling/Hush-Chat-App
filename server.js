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

  socket.on('disconnect', () => {
    console.log(`${id} disconnected`);
  });

  socket.on('chat message', (msg) => {
    console.log(`Message: ${msg}`);
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
