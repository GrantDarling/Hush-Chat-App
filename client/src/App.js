// Import Component
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

import './App.scss';
// import io from 'socket.io-client';

// const socket = io.connect('http://localhost:5000');

let App = () => {
  return (
    <Router>
      <Navbar />
    </Router>
  );
};

export default App;
