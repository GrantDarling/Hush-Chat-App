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
  socket.on('create room', (room, host) => {
    if(!activeRooms.includes(room)) {
      x = [];
      x.push(room);
      x.push(host);
      activeRooms.push(x);
      console.log(`${activeRooms}`)
    }
  });
var activeUsers;
var activeUsers2;
  // Join an existing room instance
  socket.on('join room', (room) => {
      socket.join(room);
      console.log('join successful: ' + room)

      for (const room in activeRooms) {
        activeUsers = io.sockets.adapter.rooms.get(activeRooms[room][0]);
        activeUsers2 = Array.from(activeUsers);
        console.log(activeUsers2);
        activeRooms[room][2] = activeUsers2.length;
      }
      
      console.log(activeRooms);
  });

  // Leave an existing room instance
  socket.on('leave room', (room) => {
    socket.leave(room);

      for (const room in activeRooms) {
        activeUsers = io.sockets.adapter.rooms.get(activeRooms[room][0]);
        console.log(activeUsers);
        //activeUsers2 = Array.from(activeUsers);
        //console.log(activeUsers2);
        //activeRooms[room][1] = activeUsers2.length;
      }

    console.log('leave(all) successful: ' + room)
  });

  // Leave an existing room instance
  socket.on('leave all rooms', () => {
  
      for (const room in activeRooms) {
        activeUsers = io.sockets.adapter.rooms.get(activeRooms[room][0]);
        console.log('XXXX ' + activeRooms[room] + 'is ' + Array.from(activeUsers));
        console.log('my id is: ' + id);
        if(Array.from(activeUsers).includes(id)) {
          Array.from(activeUsers).pop(id);
          console.log('popped: ' + id);
        }
        console.log('YYYY ' + activeRooms[room] + 'is ' + Array.from(activeUsers));
        // activeUsers2 = Array.from(activeUsers);
        // console.log(activeUsers2);
        // activeRooms[room][2] = activeUsers2.length;
      }

    activeRooms.forEach((room) => {
          socket.leave(room);
          console.log('leave successful: ' + room)
    })
  });

  // Send chat within an existing room instance
  socket.on('chat message', (message, room, guest) => {
    socket.to(room).emit('chat message', message, guest);
    console.log(message + ' ' + id )
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
