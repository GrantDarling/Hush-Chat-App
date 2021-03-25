const express = require('express');
const { emit } = require('process');
const app = express();
const server = require('http').Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

io.on("connection", (socket) => {
  const {id} = socket;

  socket.emit("connection", id);

  console.log(`${id} connected...`)
});

app.get('/', (res, req) => {
  req.send('Hush App Server...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));
