import React, { useEffect, useCallback } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';
import RoomLogic from '../logical/Room';
import webRTC from '../logical/webRTC';
import useOnSocket from '../logical/hooks/useOnSocket';


const Room = ({ state, socket}) => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [
        setLocalRoom, setClientRooms, setJoinedRoom, 
        onChange, sendMessage, 
        room, setRoom,
        videoElement, videoElement2,
        video, switcher, video2, peerConnection, peerConnections, config,
        cleanUpCode, clickedNewRoom
    ] = RoomLogic(socket, state, toggleModal);
    const { isCreated, setURL, isHost, hasJoined, chatMessage } = room;
    const [onWebRTC, displayUserMedia] = webRTC(socket, peerConnections, config);
    useOnSocket(socket);



    // Clicked New Room
    useEffect(() => {
        clickedNewRoom();
    }, [clickedNewRoom]);

    // Room Created
    useEffect(() => {
        if(isCreated) {
            if(switcher) {
                onWebRTC(videoElement, peerConnection, video);
                switcher.current = false;
            }

            displayUserMedia(socket, videoElement);
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setLocalRoom(setRoom, room);
        }
    }, [isCreated, switcher, onWebRTC, socket, displayUserMedia, peerConnection, room, setLocalRoom, setRoom, videoElement, video]);

    // Guest Joined 
    useEffect(() => {
        if (!hasJoined && state.hasJoined) {
            setJoinedRoom(state);
            socket.emit('join room', state.name);
            socket.emit('refresh clients', state.name, state);
        }    
    }, [hasJoined, setJoinedRoom, socket, state]);

    // Clean up use effect
    useEffect(() => {
        // Clean up & close room
        return function cleanup() {
            cleanUpCode();
        }
    },[cleanUpCode])


    // !!! WEBRTC CODE !!!

    useEffect(() => {
        if(state.hasJoined) {
            socket.emit("watcher");
            console.log('trying to connect...');
            if(switcher) {
                displayUserMedia(socket, videoElement2);
                onWebRTC(videoElement2, peerConnection, video2);
                switcher.current = false;
            }
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
