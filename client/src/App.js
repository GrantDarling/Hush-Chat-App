import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import Navbar from './components/layout/Navbar';
import Routes from './components/routes/Routes';
import Socket from './components/logical/Socket';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const App = () => {
  const [postMessage] = Socket();

  useEffect(() => {
    socket.on('chat message', (guest, message, messageClass) => {
      postMessage(guest, message, messageClass)
    });
  }, [postMessage]);

  return (
    <Router>
      <Navbar />
      <Switch>
        <Routes socket={socket} />
      </Switch>
    </Router>
  );
};

export default App;
