import React, { useEffect, useState, createRef, useRef } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';
import RoomLogic from '../logical/RoomLogic';
import webRTC from '../logical/webRTC';
import useOnSocket from '../logical/hooks/useOnSocket';


const Room = ({ state, socket }) => {
    const [onWebRTC, onWebRTC2, displayUserMedia] = webRTC();
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


    const videoElement = useRef();  
    const videoElement2 = useRef();    
    const video = useRef(); 
    const video2 = useRef();  
    const peerConnection = createRef();
    const peerConnection2 = createRef();

    useOnSocket(socket);


    const peerConnections = {};
    const config = {
        iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
    };   

    useEffect(() => {


    }, []);

    useEffect(() => {

        // Initiate new room
        if (!!state.clickedNewRoom) {
            toggleModal();
            setClientRooms(setRoom, room, socket, peerConnection2, video2);
            state.clickedNewRoom = '';
        }

        // Local room created
        if(isCreated) {
            onWebRTC(socket, videoElement, peerConnections, config, peerConnection, video);
            displayUserMedia(socket, videoElement, "broadcaster");
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setLocalRoom(setRoom, room);
        }

        // Guest has joined
        if (!hasJoined && state.hasJoined) {
            setJoinedRoom(setRoom, room, state);
            socket.emit('join room', state.name);
            socket.emit('refresh clients', state.name, state);
            console.log('should now rfresh clients')

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
    },[socket, room, state, isCreated, isHost, hasJoined, setURL, toggleModal, setLocalRoom, setClientRooms, setJoinedRoom, peerConnection])


    // !!! WEBRTC CODE !!!

    useEffect(() => {
        if(state.hasJoined) {
            socket.emit("watcher");
            console.log('trying to connect...');

        
        const config = {
            iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
        };

        onWebRTC(socket, videoElement2, peerConnections, config, peerConnection2, video2);
        displayUserMedia(socket, videoElement2, "broadcaster");

        }
    }, [state.hasJoined, video])
    

    // !!! WEBRTC CODE !!!
    
    
    
    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {room.name}</h3>
        <section className="select">
        <label htmlFor="audioSource">Audio source: </label>
        <select id="audioSource"></select>
        </section>

        <section className="select">
        <label htmlFor="videoSource">Video source: </label>
        <select id="videoSource"></select>
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
                            ? <video ref={videoElement} id="localVideo" playsInline autoPlay muted></video> // &&<video ref={videoElement2} id="localVideo" playsInline autoPlay muted></video>  // <video id="localVideo" autoPlay playsInline controls={false}/> // <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }
                        {!!room.host.allowVideo 
                            ? <video ref={videoElement2} id="localVideo" playsInline autoPlay muted></video>  // <video id="localVideo" autoPlay playsInline controls={false}/> // <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }
                    </div>
                    <div className='guest'>
                        <h4 className='username' >{!!room.guest.name ? `@${room.guest.name}` : 'waiting for guest...'}</h4>
                        {!!room.guest.allowVideo 
                            ?  <video ref={video} id="guestVideo" autoPlay playsInline controls={false}/>// <video  id="guestVideo" autoPlay playsInline controls={false}/> // <img src={GuestPlaceholder} alt="Guest Placeholder" className='active-video' />
                            : <img src={GuestPlaceholder} alt="Guest Placeholder" className='' /> }
                            {!!room.guest.allowVideo 
                            ?  <video ref={video2} id="guestVideo" autoPlay playsInline controls={false}/>// <video  id="guestVideo" autoPlay playsInline controls={false}/> // <img src={GuestPlaceholder} alt="Guest Placeholder" className='active-video' />
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
