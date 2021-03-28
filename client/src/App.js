// Import Component
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Routes from './components/routes/Routes';
import './App.scss';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

let App = () => {

useEffect(() => {
  console.log('opened!');
            socket.on('chat message', (message, guest) => {
                console.log(message);
                let chatContainer = document.getElementById('chat');
                let messageContainer = document.createElement('div');
                let messageSender = document.createElement('h3');
                let messageTextContainer = document.createElement('p');

                //alert('sending now!');

                messageContainer.classList.add('message-guest');
                messageContainer.appendChild(messageSender);
                messageSender.innerHTML = `@${guest}`;
                messageContainer.appendChild(messageTextContainer);
                messageTextContainer.innerHTML = `${message}`;

                chatContainer.appendChild(messageContainer);
                chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
            });

  }, []);

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
