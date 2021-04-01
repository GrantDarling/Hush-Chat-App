import React, { useEffect, useState } from 'react';
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
            allowVideo: '',
        },        
        guest: {
            name: '',
            allowVideo: ''
        },
        chatMessage: '',
        isCreated: false,
        isHost: true,
        hasJoined: false,
        setURL: window.location.href,
    });
    const { isCreated, setURL, isHost, hasJoined, chatMessage } = room;

    const [setLocalRoom, setClientRooms, setJoinedRoom, onChange, sendMessage] = RoomLogic(room, setRoom, socket, chatMessage);

    useEffect(() => {

        // Initiate new room
        if (!!state.clickedNewRoom) {
            toggleModal();
            setClientRooms(setRoom, room, socket);
            state.clickedNewRoom = false;
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

        // Clean up & close room
        return function cleanup() {
            let thisURL = window.location.href;
            if (thisURL !== setURL && isHost) {
                socket.emit('close room', room.name);
            }

            if(thisURL !== setURL) return setRoom({});
        }
    },[socket, room, state, isCreated, isHost, hasJoined, setURL, toggleModal, setLocalRoom, setClientRooms, setJoinedRoom])

    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {room.host.allowVideo} {room.name}</h3>
            <div className='chatbox'> 
                <div className='chat'>
                    <div className='messages' id='chat'>
                        <ul className="message-emit">
                            <li>{!!room.name ? `@'${room.name}' group created...` : '' }</li>
                            <li>{!!room.host.name ? `@${room.host.name} has entered the chat.` : '' }</li>
                            <li>{!!room.guest.name ? `@${room.guest.name} has entered the chat.` : '' }</li>
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
                        <img src={HostPlaceholder}  alt="Host Placeholder" className={ !!room.host.allowVideo ? 'active-video' : '' } />
                    </div>
                    <div className='guest'>
                        <h4 className='username' >{!!room.guest.name ? `@${room.guest.name}` : ''}</h4>
                        <img src={GuestPlaceholder} alt="Guest Placeholder" className={ !!room.guest.allowVideo ? 'active-video' : '' }/>
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
