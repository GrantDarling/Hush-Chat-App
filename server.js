const express = require('express');
const { connectSocket } = require('./socketAPI');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server, { 
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Connect SocketIO
connectSocket(io);

// Start server
app.get('/', (res, req) => req.send('Hush App Server...'));

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')))
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/client/dist', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));