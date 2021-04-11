import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Routes from './components/routes/Routes';
import io from 'socket.io-client';
import useOnSocket from './components/logical/hooks/useOnSocket';

const socket = io.connect('https://calm-tor-02762.herokuapp.com/' || 'http://localhost:5000');

const App = () => {
  useOnSocket(socket);

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
