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

// Socket IO

io.on('connection', (socket) => {
  const { id } = socket.client;
  console.log(`All Rooms: ${socket.rooms}`);


  io.emit('connection', id);

  // Create room
  socket.on('create', function (room) {
    socket.join(room.toString());

    io.to("x").emit('chat message', "In Chatroom X!", id);
    io.to("y").emit('chat message', "In Chatroom Y!", id);

    console.log(`${id} connected to ${room}`);
    socket.rooms.forEach(function(roomName){
      console.log(`Lobby: ${roomName}`);
    });

    

    socket.rooms.forEach(function(roomName){
        //console.log('One room is: ' + roomName);
    });
  });

  socket.on('disconnect', () => {
    //console.log(`${id} disconnected`);
  });

  socket.on('chat message', (message) => {
    //io.emit('chat message', message, id);
    io.sockets.in("test").emit('chat message', message, id);


  });
});



// Express Routes 

app.get('/', (res, req) => {
  req.send('Hush Chat/Video App Server');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
