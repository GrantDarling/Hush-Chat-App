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
    const videoElement = createRef();




     // let peerConnection;
    // useEffect(() => {


    // }, [socket, videoElement, peerConnection, config]);


    // Call WebRTC
    //useEffect(() => webRTC('video#guestVideo'), [room.host.allowVideo, webRTC])

      socket.on("candidate", (id, candidate) => {
        peerConnection.current
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e));
      });


        

      socket.on("broadcaster", () => {
        socket.emit("watcher");
      });



    useEffect(() => {

const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};
socket.emit("watcher");

        // Initiate new room
        if (!!state.clickedNewRoom) {
            toggleModal();
            setClientRooms(setRoom, room, socket);
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
            setJoinedRoom(setRoom, room, state);
            socket.emit('refesh clients', state.name, state);
            socket.emit('join room', state.name);
        }

                  socket.on("offer", (id, description) => {
        console.log("offer")
        peerConnection.current = new RTCPeerConnection(config);
        peerConnection.current
          .setRemoteDescription(description)
          .then(() => peerConnection.current.createAnswer())
          .then(sdp => peerConnection.current.setLocalDescription(sdp))
          .then(() => {
            socket.emit("answer", id, peerConnection.current.localDescription);
            console.log(peerConnection.current)
          });
        peerConnection.current.ontrack = event => {
                console.log('SOMEHING')
          console.log('candidate')
            videoElement.current.srcObject = event.streams[0];
        };
        peerConnection.current.onicecandidate = event => {
          console.log('candidate')
          if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
          }
        };
      });

      // window.onunload = window.onbeforeunload = () => {
      //   socket.close();
      //   peerConnection.close();
      // };



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



    },[socket, room, state, isCreated, isHost, hasJoined, setURL, toggleModal, setLocalRoom, setClientRooms, setJoinedRoom, peerConnection, videoElement])

    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {room.name}</h3>
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
                            ?  <video id="localVideo" autoPlay playsInline controls={false}/> // <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }
                    </div>
                    <div className='guest'>
                        <h4 className='username' >{!!room.guest.name ? `@${room.guest.name}` : 'waiting for guest...'}</h4>
                        {!!room.guest.allowVideo 
                            ?      <video ref={videoElement} autoPlay playsInline id="guestVideo" muted></video> 
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
