import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.scss';
import Navbar from './components/layout/Navbar';
import Routes from './components/routes/Routes';
import Socket from './components/logical/Socket';
import webRTC from './components/logical/webRTC';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const App = () => {
  const [postMessage] = Socket();
    const config = {
        iceServers: [{ "urls": "stun:stun.l.google.com:19302", }]
    };

  useEffect(() => {

    const peerConnection = new RTCPeerConnection(config);

    async function makeCall() {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', (offer));
    }


    socket.on('answer', async (answer) => {
      if(answer) {
        console.log("answer successful");
        const remoteDesc = new RTCSessionDescription(answer);
        await peerConnection.setRemoteDescription(remoteDesc);
        console.log(peerConnection);
        webRTC('video#localVideo', peerConnection);

        peerConnection.onicecandidate = event => {
           console.log('candidate');
          if (event.candidate) {
            console.log('candidate');
              peerConnection
              .addIceCandidate(new RTCIceCandidate(event.candidate))
              .catch(e => console.error(e));
           // socket.emit("candidate", id, event.candidate);
          }
        };
      }
    });

    socket.on('offer', async (offer) => {
      if(offer) {
        console.log("now sending offer: " + offer);
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', (answer));
        //signalingChannel.send({'answer': answer});
      }
              webRTC('video#guestVideo', peerConnection);
    });
        
    // !!! THIS CODE NEVER TRIGGERS AND 'peerConnection.iceCandidate' returns null
    peerConnection.addEventListener('icecandidate', event => {
      console.log('triggered outside scope'); // trigger check
        if (event.candidate) {
            console.log('triggered inside scope'); // trigger check
            socket.emit('candidate', event.candidate);
        }
    });


    // BELOW WILL NOT TRIGGER WITHOUT 'icecandidate' LISTENER

    // Listen for remote ICE candidates and add them to the local RTCPeerConnection ()
    socket.on('candidate', async (iceCandidate) => {
        if (iceCandidate) {
            try {
                await peerConnection.addIceCandidate(iceCandidate);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
      })

    // Confirm they are connected
    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            // Peers connected!
            console.log('success')
        }
    });
        makeCall();
                

  }, []);

  useEffect(() => {
    socket.on('chat message', (guest, message, messageClass, audio) => {
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
