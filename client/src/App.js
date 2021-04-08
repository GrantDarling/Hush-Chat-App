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
    socket.on('message', (guest, message, messageClass, audio) => {
      postMessage(guest, message, messageClass, audio)
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
