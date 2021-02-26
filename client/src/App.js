// Import Component
import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

// Change to class component
class App extends Component {
  // Add constructor to initiate
  constructor() {
    super();
    this.state = { msg: '' };
    this.state = { update: '' };
  }

  // Function for getting text input
  onTextChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  // Function for sending message to chat server
  onMessageSubmit = () => {
    socket.emit('chat message', this.state.msg);

    this.setState({ msg: '' });
  };

  componentDidMount() {
    socket.on('chat message', function (msg) {
      console.log(msg);

      let texts = document.getElementById('texts');
      var item = document.createElement('p');
      item.textContent = msg;
      texts.appendChild(item);
    });
  }

  render() {
    return (
      <div className='container'>
        <h1>F**k this app.</h1>
        <div id='texts'>
          <input
            onChange={(e) => this.onTextChange(e)}
            value={this.state.msg}
          />
          <button onClick={this.onMessageSubmit}>Send</button>
        </div>
        <h3>{this.state.msg}</h3>
      </div>
    );
  }
}

export default App;

// Old Code

// import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import socketIOClient from 'socket.io-client';
// const ENDPOINT = 'http://localhost:3000/'; // !!! Change this

// function App() {
//   const [response, setResponse] = useState('');

//   useEffect(() => {
//     const socket = socketIOClient(ENDPOINT);
//     socket.on('chat message', (data) => {
//       setResponse(data);
//     });
//   }, []);

//   return (
//     <div className='App'>
//       <header className='App-header'>
//         <img src={logo} className='App-logo' alt='logo' />
//         <p>
//           Chat App
//           <br />
//           <br />
//           Response: {response}
//         </p>
//         {console.log(response)}
//       </header>
//     </div>
//   );
// }

// export default App;
