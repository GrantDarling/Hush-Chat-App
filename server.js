const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, { cors: 
  { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// socket.io functions
let rooms = [];

io.on("connection", (socket) => {
  const {id} = socket.client;
  console.log(`${id} connected...`);

  socket.on('disconnect', function() {
    console.log(`${id} disconnected...`);
  });

  // Create a new room instance
  socket.on('create room', (createdRoom, currentHost) => {
    let listOfRooms = [];

    for (room of rooms) { 
      listOfRooms.push(room.name) 
    };

    if(!listOfRooms.includes(createdRoom)) {
        let addRoom = {
          name: createdRoom,
          host: currentHost,
          users: []
        };
       rooms.push(addRoom);
    }
  });

  // Join an existing room instance
  socket.on('join room', (joinedRoom) => {
    socket.join(joinedRoom);
    
    for (room of rooms) { 
      if(room.name == joinedRoom && !room.users.includes(id)) { 
        room.users.push(id); 
      };
    };
  });

  // Leave an existing room instance
  socket.on('leave all rooms', () => {

    for (room of rooms) { 
      if(room.users.includes(id)) { 
        room.users.pop(id); 
      };
      
      socket.leave(room);
    };
  });

  // Leave an existing room instance
  socket.on('refesh clients', (room, state, roomStateVideo) => {
    socket.to(room).emit('refesh clients', state, roomStateVideo)
    console.log(roomStateVideo)
  } );

  // Send chat within an existing room instance
  socket.on('chat message', (message, room, guest) => {
    socket.to(room).emit('chat message', message, guest);
    console.log(message + ' ' + id );
  });

  // Get a list of available rooms
  socket.on('get rooms', () => {
    io.emit('get rooms', rooms);
  });
});

// Define routes & start server
app.get('/', (res, req) => {
  req.send('Hush App Server...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
