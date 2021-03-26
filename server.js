const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require("socket.io")(server, { cors: 
  { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Init socket.io
let activeRooms = [];

io.on("connection", (socket) => {
  const {id} = socket.client;
  console.log(`${id} connected...`);

  socket.on('create', (room) => {
    socket.join(room);

    if(!activeRooms.includes(room)) {
      activeRooms.push(room);
    }

    console.log(`Active rooms: ${activeRooms}`);
  });

  socket.on('chat message', (message, room) => {
    io.sockets.in(room).emit('chat message', message, id);
  });

  socket.on('get rooms', () => {
    io.emit('get rooms', activeRooms);
  });
});

// Define routes
app.get('/', (res, req) => {
  req.send('Hush App Server...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
