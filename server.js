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
let allRooms = ['test'];

io.on('connection', (socket) => {
  const { id } = socket.client;

    // const rooms = socket.rooms;

    //   console.log('looping rooms...');
    //   console.log(rooms);
    //   rooms.forEach(function(roomName){
    //   console.log('One room is: ' + roomName);
    // });

  //console.log(Object.keys(socket.rooms).filter(item => item!=socket.id));

  io.emit('connection', id);

  // Create room
  socket.on('create', function (room) {
    socket.join(room.toString());
    allRooms.push(room);

    console.log(`These are all my rooms: ${allRooms}`)

    io.to("x").emit('chat message', "In Chatroom X!", id);
    io.to("y").emit('chat message', "In Chatroom Y!", id);

    //console.log(`${id} connected to ${room}`);
      //console.log(io.sockets.adapter.rooms);

    socket.rooms.forEach(function(roomName){
      //console.log(`Lobby: ${roomName}`);
    });

    console.log(Object.keys(io.sockets.adapter.rooms));


    
  });

  socket.on('chat message', (message, room) => {



    // ******* IMPORTANT ******* io.to("x").emit('chat message', message, id);



    io.to(room).emit('chat message', message, id);
    //io.emit('chat message', message, id);
    io.sockets.in("test").emit('chat message', message, id);
  });


  socket.on('disconnect', () => {
    //console.log(`${id} disconnected`);
  });


  socket.on('sendRooms', () => {
    console.log(allRooms)
    io.emit('sendRooms', allRooms);
  });
  
});



// Express Routes 

app.get('/', (res, req) => {
  req.send('Hush Chat/Video App Server');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
