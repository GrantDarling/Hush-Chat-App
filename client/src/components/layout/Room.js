import React, { useEffect, useState, useRef, createRef} from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';
import RoomLogic from '../logical/RoomLogic';


const Room = ({ state, socket }) => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [room, setRoom] = useState({
        name: '',
        host: {
            name: '',
            allowVideo: 'true',
        },        
        guest: {
            name: '',
            allowVideo: 'true'
        },
        chatMessage: '',
        isCreated: false,
        isHost: true,
        hasJoined: false,
        setURL: window.location.href,
    });
    const { isCreated, setURL, isHost, hasJoined, chatMessage } = room;
    const [setLocalRoom, setClientRooms, setJoinedRoom, onChange, sendMessage] = RoomLogic(room, setRoom, socket, chatMessage);
    // const [caller, setCaller] = useState(false);

  // let peerConnection = useRef();
  const peerConnection = createRef();
    const videoElement = useRef();



    // Call WebRTC
    //useEffect(() => webRTC('video#guestVideo'), [room.host.allowVideo, webRTC])

// useEffect(() =>{
//   socket.emit("broadcaster");
// }, [])

    useEffect(() => {



        // Initiate new room
        if (!!state.clickedNewRoom) {
           console.log('created!')
            toggleModal();
            setClientRooms(setRoom, room, socket);
            const peerConnections = {};
            const config = {
              iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
            };

            socket.on("answer", (id, description) => {
              peerConnections[id].setRemoteDescription(description);
            });

            socket.on("watcher", id => {
              peerConnection.current = new RTCPeerConnection(config);
              peerConnections[id] = peerConnection.current;

            let stream = videoElement.current.srcObject;
            stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

            peerConnection.current.onicecandidate = event => {
              if (event.candidate) {
                socket.emit("candidate", id, event.candidate);
              }
            };

            peerConnection.current
              .createOffer()
              .then(sdp => peerConnection.current.setLocalDescription(sdp))
              .then(() => {
                socket.emit("offer", id, peerConnection.current.localDescription);
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
            if(stream) {
            videoElement.current.srcObject = stream;
            }
            socket.emit("broadcaster");
          }

          function handleError(error) {
            console.error("Error: ", error);
          }


            state.clickedNewRoom = '';
        }

        // Local room created
        if(isCreated) {
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setLocalRoom(setRoom, room);
        }

        // Guest has joined
        if (!hasJoined && state.hasJoined) {
      //       setJoinedRoom(setRoom, room, state);
      //       socket.emit('refesh clients', state.name, state);
      //       socket.emit('join room', state.name);

      //             socket.on("candidate", (id, candidate) => {
      //   peerConnection.current
      //     .addIceCandidate(new RTCIceCandidate(candidate))
      //     .catch(e => console.error(e));
      // });


        

      // socket.on("broadcaster", () => {
      //   socket.emit("watcher");
      // });

      //             socket.on("offer", (id, description) => {
      //   console.log("offer")
      //   peerConnection.current = new RTCPeerConnection(config);
      //   peerConnection.current
      //     .setRemoteDescription(description)
      //     .then(() => peerConnection.current.createAnswer())
      //     .then(sdp => peerConnection.current.setLocalDescription(sdp))
      //     .then(() => {
      //       socket.emit("answer", id, peerConnection.current.localDescription);
      //       console.log(peerConnection.current)
      //     });
      //   peerConnection.current.ontrack = event => {
      //           console.log('SOMEHING')
      //     console.log('candidate')
      //     if(videoElement.current.srcObject) {
      //       videoElement.current.srcObject = event.streams[0];
      //     }
      //   };
      //   peerConnection.current.onicecandidate = event => {
      //     console.log('candidate')
      //     if (event.candidate) {
      //       socket.emit("candidate", id, event.candidate);
      //     }
      //   };
      // });

      // window.onunload = window.onbeforeunload = () => {
      //   socket.close();
      //   peerConnection.close();
      // };




        }


        // Clean up & close room
        return function cleanup() {
            let thisURL = window.location.href;
            if (thisURL !== setURL && isHost) {
                state.clickedNewRoom = 'true'
                socket.emit('close room', room.name);
                socket.emit('chat message', `${room.host.name} left the chat. Room closed...`, room.name, '', `message-general`, true);
                return setRoom({})
            }

            if(thisURL !== setURL) {
                socket.emit('chat message', `${room.host.name} left the chat.`, room.name, '', `message-general`, true);
                return setRoom({})
            };

        }



    },[socket, room, state, isCreated, isHost, hasJoined, setURL, toggleModal, setLocalRoom, setClientRooms, setJoinedRoom, videoElement])

    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {room.name}</h3>
                
        <section className="select">
      <label htmlFor="audioSource">Audio source: </label>
      <select id="audioSource"></select>
    </section>

    <section className="select">
      <label htmlFor="videoSource">Video source: </label>
      <select  id="videoSource"></select>
    </section>

            <div className='chatbox'> 
                <div className='chat'>
                    <div className='messages' id='chat'>
                        <ul className="message-emit">
                            <li>{!!room.name ? `'${room.name}' group created...` : '' }</li>
                            <li>{!!room.host.name ? `${room.host.name} has entered the chat.` : '' }</li>
                            <li>{!!room.guest.name ? `${room.guest.name} has entered the chat.` : '' }</li>
                        </ul>
                    </div>
                        <section className="select">
      <label htmlFor="audioSource">Audio source: </label>
      <select id="audioSource"></select>
    </section>

    <section className="select">
      <label htmlFor="videoSource">Video source: </label>
      <select id="videoSource"></select>
    </section>
                    <form className='input-controller' onSubmit={sendMessage}>
                        <input type="text" id='message-input' name='chatMessage' value={chatMessage} onChange={onChange} />
                        <button type='submit'>SEND</button>
                    </form>
                </div>
                <div className='videos'>
                    <div className='host'>
                        <h4 className='username' >{!!room.host.name ? `@${room.host.name}` : '' }</h4>
                        {!!room.host.allowVideo 
                            ?  <video ref={videoElement} autoPlay playsInline id="localVideo" muted></video>// <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }
                    </div>
                    <div className='guest'>
                        <h4 className='username' >{!!room.guest.name ? `@${room.guest.name}` : 'waiting for guest...'}</h4>
                        {!!room.guest.allowVideo 
                            ?      <video  autoPlay playsInline id="guestVideo" muted></video> 
                            // <img src={GuestPlaceholder} alt="Guest Placeholder" className='active-video' />
                            : <img src={GuestPlaceholder} alt="Guest Placeholder" className='' /> }
                    </div>
                    
                    {/* <video className='host' />
                    <video className='guest' /> */}
                </div>

                <Modal isOpen={isOpen} >
                    <CreateRoom socket={socket} onChange={onChange} toggleModal={toggleModal} room={room} setRoom={setRoom} />
                </Modal>

            </div>
        </section>
    );
};

export default Room;
