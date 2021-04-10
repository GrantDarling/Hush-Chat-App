import React, { useEffect, createRef, useRef } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';
import RoomLogic from '../logical/RoomLogic';
import webRTC from '../logical/webRTC';
import useOnSocket from '../logical/hooks/useOnSocket';


const Room = ({ state, socket }) => {
    const [onWebRTC, displayUserMedia] = webRTC();
    const [isOpen, toggleModal] = ModalSwitch();
    const [setLocalRoom, setClientRooms, setJoinedRoom, onChange, sendMessage, room, setRoom] = RoomLogic(socket);
    const { isCreated, setURL, isHost, hasJoined, chatMessage } = room;


    const videoElement = useRef(null);  
    const videoElement2 = useRef(null);    
    const video = useRef(); 
    const switcher = useRef(true);
    const video2 = useRef();  
    const peerConnection = createRef();
    const peerConnections = {};
    const config = {
        iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
    };   
    

    useOnSocket(socket);

    useEffect(() => {

        // Initiate new room
        if (!!state.clickedNewRoom) {
            state.clickedNewRoom = '';
            toggleModal();
            setClientRooms(peerConnection, video2);
        }

        // Local room created
        if(isCreated) {
            if(switcher) {
                onWebRTC(socket, videoElement, peerConnections, config, peerConnection, video);
                switcher.current = false;
            }

            displayUserMedia(socket, videoElement, "broadcaster");
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setLocalRoom(setRoom, room);
        }

        // Guest has joined
        if (!hasJoined && state.hasJoined) {
            setJoinedRoom(state);
            socket.emit('join room', state.name);
            socket.emit('refresh clients', state.name, state);

        }

        // Clean up & close room
        return function cleanup() {
            let thisURL = window.location.href;
            if (thisURL !== setURL && isHost) {
                state.clickedNewRoom = 'true'
                socket.emit('close room', room.name);
                socket.emit('message', `${room.host.name} left the chat. Room closed...`, room.name, '', `message-general`, true);
                return setRoom({})
            }

            if(thisURL !== setURL) {
                socket.emit('message', `${room.host.name} left the chat.`, room.name, '', `message-general`, true);
                return setRoom({})
            };

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket, room, state, isCreated, isHost, hasJoined, setURL, toggleModal, setLocalRoom, setClientRooms, setJoinedRoom, peerConnection])


    // !!! WEBRTC CODE !!!

    useEffect(() => {
        if(state.hasJoined) {
            socket.emit("watcher");
            console.log('trying to connect...');
            if(switcher) {
                onWebRTC(socket, videoElement2, peerConnections, config, peerConnection, video2);
                switcher.current = false;
            }
            displayUserMedia(socket, videoElement2, "broadcaster");
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.hasJoined, video]) //, 

    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {room.name}</h3>
            <section className="select">
                <select id="videoSource">
            </select>
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
                    <form className='input-controller' onSubmit={sendMessage}>
                        <input type="text" id='message-input' name='chatMessage' value={chatMessage} onChange={onChange} />
                        <button type='submit'>SEND</button>
                    </form>
                </div>
                <div className='videos'>
                    <div className='host'>
                        <h4 className='username' >{!!room.host.name ? `@${room.host.name}` : '' }</h4>
                        {!!room.host.allowVideo 
                            ? <video ref={!state.hasJoined ? videoElement : videoElement2} id="localVideo" playsInline autoPlay muted></video> // &&<video ref={videoElement2} id="localVideo" playsInline autoPlay muted></video>  // <video id="localVideo" autoPlay playsInline controls={false}/> // <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }

                    </div>
                    <div className='guest'>
                        <h4 className='username' >{!!room.guest.name ? `@${room.guest.name}` : 'waiting for guest...'}</h4>
                        {!!room.guest.allowVideo 
                            ?  <video ref={!state.hasJoined ? video : video2} id="guestVideo" autoPlay playsInline controls={false}/>// <video  id="guestVideo" autoPlay playsInline controls={false}/> // <img src={GuestPlaceholder} alt="Guest Placeholder" className='active-video' />
                            : <img src={GuestPlaceholder} alt="Guest Placeholder" className='' /> }
                    </div>
                </div>

                <Modal isOpen={isOpen} >
                    <CreateRoom socket={socket} onChange={onChange} toggleModal={toggleModal} room={room} setRoom={setRoom} />
                </Modal>

            </div>
        </section>
    );
};

export default Room;
