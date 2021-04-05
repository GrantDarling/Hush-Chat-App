import React, { createRef, useEffect, useState } from 'react';
import Modal from './Modal';
import JoinRoom from './ModalJoinRoom';
import ModalSwitch from '../logical/Modal';


const Lobby = ({socket}) => {
  const [isOpen, toggleModal] = ModalSwitch();
  const [lobby, setLobby] = useState([]);
  const [room, setRoom] = useState({});
  const videoElement = createRef();

  const onClick = (chosenRoom) => {
    setRoom(chosenRoom);
    toggleModal();
  }

    //let peerConnection = useRef('');




  useEffect(() => {

    const peerConnections = {};
    const config = {
      iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
    };


    socket.on("answer", (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on("watcher", id => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      let stream = videoElement.current.srcObject;
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", id, peerConnection.localDescription);
        });
    });

    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    // socket.on("disconnectPeer", id => {
    //   peerConnections[id].close();
    //   delete peerConnections[id];
    // });

    // window.onunload = window.onbeforeunload = () => {
    //   socket.close();
    // };

    // Get camera and microphone
    // const videoElement = document.querySelector("video");
    const audioSelect = document.querySelector("select#audioSource");
    const videoSelect = document.querySelector("select#videoSource");

    audioSelect.onchange = getStream;
    videoSelect.onchange = getStream;

    getStream()
      .then(getDevices)
      .then(gotDevices);

    function getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    }

    function gotDevices(deviceInfos) {
      window.deviceInfos = deviceInfos;
      for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
          option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
          audioSelect.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
          option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
          videoSelect.appendChild(option);
        }
      }
    }

    function getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      const audioSource = audioSelect.value;
      const videoSource = videoSelect.value;
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
      };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
    }

    function gotStream(stream) {
      window.stream = stream;
      audioSelect.selectedIndex = [...audioSelect.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
      );
      videoSelect.selectedIndex = [...videoSelect.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
      );
      videoElement.current.srcObject = stream;
      socket.emit("broadcaster");
    }

    function handleError(error) {
      console.error("Error: ", error);
    }
    
  }, [socket, videoElement]);


  

  // useEffect(() => {
  //   socket.on('get rooms', (rooms) => setLobby(rooms));
  //   socket.emit('leave all rooms');
  //   socket.emit('get rooms');

  //   return () => { setLobby({})}
  // });
  
  return (
    <section className='Lobby'>
      <div className='chatrooms'>
    <video ref={videoElement} autoPlay playsInline id="localVideo" muted></video>
        <section className="select">
      <label htmlFor="audioSource">Audio source: </label>
      <select id="audioSource"></select>
    </section>

    <section className="select">
      <label htmlFor="videoSource">Video source: </label>
      <select  id="videoSource"></select>
    </section>
        {lobby.length > 0 ? lobby.map((room) => 
          (<div key={room.name} className={room.users.length < 2 ? 'chatroom' : 'chatroom--locked'}>
              <div className='details-container'>
                <h3>
                  <small>Room Name: </small>
                  {room.name}
                </h3>
                <h3>
                  <small>Host: </small>
                  {room.host.name}
                </h3>
                { room.users.length < 2 
                  ? <h4>Capacity: {room.users.length}/2</h4> 
                  : <div className='join'>FULL</div> 
                }
              </div>
              <button className='join' onClick={() => onClick(room)}>JOIN</button>
            </div>))
            : 
            (<div className="chatrooms--none">
              <h1>Currently no chatrooms available.</h1>
            </div>)
        }

        <Modal isOpen={isOpen} toggleModal={toggleModal} >
          <JoinRoom room={room} lobby={lobby} />
        </Modal>

      </div>
    </section>
    )
};

export default Lobby;
