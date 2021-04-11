const express = require('express');
const { connectSocket } = require('./socketAPI');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require("socket.io")(server, { 
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Connect SocketIO
connectSocket(io);

// Serve static assets in production 
if(process.env.NODE_ENV === 'production') {
  // Set static folder 
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));