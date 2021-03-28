const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, { cors: 
  { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

let activeRooms = [];

io.on("connection", (socket) => {
  const {id} = socket.client;
  console.log(`${id} connected...`);

  // Create a new room instance
  socket.on('create room', (room) => {
    if(!activeRooms.includes(room)) {
      activeRooms.push(room);
      console.log(`${activeRooms}`)
    }
  });

  // Join an existing room instance
  socket.on('join room', (room) => {
      socket.join(room);
      console.log('join successful: ' + room)
      var fuckingTest = io.sockets.adapter.rooms.get('x');
      // console.log(fuckingTest);
  });

  console.log(io.sockets.adapter.rooms['x']);
  // Leave an existing room instance
  socket.on('leave room', (room) => {
    socket.leave(room);
    console.log('leave(all) successful: ' + room)
  });

  // Leave an existing room instance
  socket.on('leave all rooms', () => {
        

    activeRooms.forEach((room) => {
          socket.leave(room);
          socket.removeAllListeners(room);
          console.log('leave successful: ' + room)
    })
  });

  // Send chat within an existing room instance
  socket.on('chat message', (message, room) => {
    socket.to(room).emit('chat message', message, id);
    console.log(message + ' ' + id)
  });

  // Get a list of available rooms
  socket.on('get rooms', () => {
    io.emit('get rooms', activeRooms);
  });

  socket.on('disconnect', function() {
    console.log(`${id} disconnected...`);
  });

});

// Define routes & start server
app.get('/', (res, req) => {
  req.send('Hush App Server...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
