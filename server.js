const express = require('express');
const { connectSocket } = require('./socketAPI');
const app = express();
const path = require('path');
const cors = require('cors')
const server = require('http').Server(app);
const io = require("socket.io")(server, { 
  cors: { origin: 'https://hush-chat-app.herokuapp.com/', methods: ['GET', 'POST'] }
});

// Connect SocketIO
app.use(cors());
connectSocket(io);

// Require https
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

// Serve static assets in production 
if(process.env.NODE_ENV === 'production') {

  // Set static folder & require https
  app.use(requireHTTPS, express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen on localhost:${PORT}...`));