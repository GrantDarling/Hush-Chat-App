import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:3000/'; // !!! Change this

function App() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('chat message', (data) => {
      setResponse(data);
    });
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Chat App
          <br />
          <br />
          Response: {response}
        </p>
        {console.log(response)}
      </header>
    </div>
  );
}

export default App;
