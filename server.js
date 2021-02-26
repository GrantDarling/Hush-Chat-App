const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/');
});

// add middleware
//app.use(express.static('client/src'));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('listening on localhost:' + PORT);
});
