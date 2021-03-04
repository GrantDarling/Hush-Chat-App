// Import Component
import React, { useState, useEffect } from 'react';
import './App.scss';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

let App = () => {
  return (
    <div className='container'>
      <h1>Hush app.</h1>
      <div id='texts'></div>
    </div>
  );
};

export default App;
