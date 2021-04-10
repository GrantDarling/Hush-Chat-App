import React, { useEffect } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';
import RoomLogic from '../logical/Room';
import useOnSocket from '../logical/hooks/useOnSocket';

const Room = ({ state, socket }) => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [
        onChange, sendMessage, 
        room, setRoom,
        videoElement, videoElement2,
        video, video2,
        cleanUpCode, clickedNewRoom, roomWasCreated, userHasJoinedFunc, otherFunc
    ] = RoomLogic(socket, state, toggleModal);
    const { chatMessage } = room;
    useOnSocket(socket);

    useEffect(() => {
        clickedNewRoom(); // Clicked New Room
    }, [clickedNewRoom]);

    // Room Created
    useEffect(() => {
        roomWasCreated();
    }, [roomWasCreated]);

    // Guest Joined 
    useEffect(() => {
        userHasJoinedFunc();
    }, [userHasJoinedFunc]);

    useEffect(() => {
        otherFunc();
    }, [otherFunc]);

    
    useEffect(() => {
        return function cleanup() {
            cleanUpCode();     // Clean up and leave room
        }
    },[cleanUpCode])

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
