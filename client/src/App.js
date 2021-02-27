// Import Component
import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

let App = () => {
  const [message, setMessage] = useState({
    id: '',
    text: ''
  });

  useEffect(() => {
    socket.on('chat message', function (msg) {
      const texts = document.getElementById('texts');
      const item = document.createElement('p');

      console.log(msg);
      item.textContent = `${msg} and ${message.id}`; //User ${id}:
      texts.appendChild(item);
    });

    socket.on('connection', (id) => {
      console.log(id);
    });
  }, []);

  const onChange = (e) => setMessage({ message: e.target.value });

  const onSubmit = () => {
    socket.emit('chat message', message.message);

    setMessage({ text: '' });
  };

  return (
    <div className='container'>
      <h1>F**k this app.</h1>
      <div id='texts'>
        <input onChange={(e) => onChange(e)} value={message.text} />
        <button onClick={onSubmit}>Send</button>
      </div>
    </div>
  );
};

export default App;
