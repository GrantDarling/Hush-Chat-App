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

  io.emit('connection', id);

  // Create room
  socket.on('create', function (room) {
    socket.join(room);
    console.log(`${id} connected to ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`${id} disconnected`);
  });

  socket.on('chat message', (message) => {
    console.log(`Message: ${message}, ID: ${socket.client.id}`);
    const id = socket.client.id;
    io.emit('chat message', message, id);
  });
});

app.get('/', (res, req) => {
  req.send('Hush Chat/Video App Server');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
