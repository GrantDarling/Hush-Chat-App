// Import Component
import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

let App = () => {
  const [message, setMessage] = useState({
    text: '',
    sender: ''
  });

  useEffect(() => {
    socket.on('chat message', function (msg, id) {
      const texts = document.getElementById('texts');
      const item = document.createElement('p');

      console.log(msg);
      item.textContent = `${id} says: ${msg}`; //User ${id}:
      texts.appendChild(item);

      // Create room
    });
    let counter = 0;
    socket.on('connection', (id) => {
      counter++;
      let room;
      console.log(id + ' ' + room + ' ' + counter);

      socket.emit('create', room); // Randomly generated and on click

      if (counter === 'room2') {
        room = 'room1';
      }

      setMessage({ sender: id });
      playVideoFromCamera();
    });

    // Video recording test
    const openMediaDevices = async (constraints) => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    };

    try {
      const stream = openMediaDevices({ video: true, audio: true });
      console.log('Got MediaStream:', stream);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }

    async function playVideoFromCamera() {
      try {
        const constraints = { video: true, audio: false }; // Make audio true
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
      } catch (error) {
        console.error('Error opening video camera.', error);
      }
    }

    playVideoFromCamera();
  }, []);

  const onChange = (e) => setMessage({ text: e.target.value });

  const onSubmit = () => {
    socket.emit('chat message', message.text);

    setMessage({ text: '' });
  };
  // <video autoplay playsinline controls='false' />;
  return (
    <div className='container'>
      <h1>F**k this app.</h1>
      <div id='texts'>
        <input onChange={(e) => onChange(e)} value={message.text} />
        <button onClick={onSubmit}>Send</button>
        <h1>User {message.sender}</h1>
        <video id='localVideo' autoPlay playsInline controls={false} />
      </div>
    </div>
  );
};

export default App;
