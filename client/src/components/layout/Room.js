import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal'

const Room = ({ state, socket }) => {
    const [isOpen, toggleModal] = ModalSwitch();

    // Initialize room state
    const [room, setRoom] = useState({
        roomName: '',
        hostUsername: '',
        guestUserName: '',
        allowVideo: '',
        allowGuestVideo: '',
        chatMessage: '',
        roomCreated: false
    })
        
    const { roomName, hostUsername, allowVideo, chatMessage, roomCreated, guestUserName, allowGuestVideo } = room;

    useEffect(() => {
        if(roomCreated) {
            socket.emit('create room', roomName, hostUsername);
            socket.emit('join room', roomName);

            setRoom({ ...room, 
                roomCreated: false,
                guestUserName:  hostUsername});
        }
    },[roomName, hostUsername, roomCreated, room, socket])

    useEffect(() => {
        if(state) {
            if (!!state.newRoom) {
                toggleModal();
            }
           if (state.joinRoomName) {
                setRoom({ ...room, roomName: state.joinRoomName,
                guestUserName: state.guestUserName,
                allowGuestVideo: state.allowGuestVideo,
                hostUsername: state.guestUserName})
                socket.emit('join room', state.joinRoomName);
                alert('this sent');
            }
        }

    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    const onChange = (e) => {
        setRoom({
        ...room,
        [e.target.name]: e.target.value
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();
        
        socket.emit('chat message', chatMessage, roomName, guestUserName);

        let chatContainer = document.getElementById('chat');
        let messageContainer = document.createElement('div');
        let messageSender = document.createElement('h3');
        let messageTextContainer = document.createElement('p');

        messageContainer.classList.add('message-host');
        messageContainer.appendChild(messageSender);
        messageSender.innerHTML = `@${hostUsername}`;
        messageContainer.appendChild(messageTextContainer);
        messageTextContainer.innerHTML = `${chatMessage}`;

        chatContainer.appendChild(messageContainer);
        chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;

        setRoom({
            ...room,
            chatMessage: ''
        });
    }

    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {roomName}</h3>
            <div className='chatbox'> 
                <div className='chat'>
                    <div className='messages' id='chat'>
                        <ul className="message-emit">
                            <li>'{roomName}' group created...</li>
                            <li>@{hostUsername} has entered the chat.</li>
                            <li>@LukeSkywalker has entered the chat.</li>
                        </ul>
                    </div>
                    <form className='input-controller' onSubmit={sendMessage}>
                        <input type="text" id='message-input' name='chatMessage' value={chatMessage} onChange={onChange} />
                        <button type='submit'>SEND</button>
                    </form>
                </div>
                <div className='videos'>
                    <div className='host'>
                        <h4 className='username' >@{hostUsername} {allowVideo}</h4>
                        <img src={HostPlaceholder}  alt="Host Placeholder" className={ !!allowVideo ? '' : 'display-none' } />
                    </div>
                    <div className='guest'>
                        <h4 className='username' >@{guestUserName}</h4>
                        <img src={GuestPlaceholder} alt="Guest Placeholder" className={ !!allowGuestVideo ? '' : 'display-none' }/>
                    </div>

                    {/* <video className='host' />
                    <video className='guest' /> */}
                </div>

                <Modal isOpen={isOpen} toggleModal={toggleModal} >
                    <CreateRoom roomName={roomName} hostUsername={hostUsername} allowVideo={allowVideo} setRoom={setRoom} room={room} toggleModal={toggleModal} onChange={onChange} socket={socket} roomCreated={roomCreated} />
                </Modal>

            </div>
        </section>
    );
};

export default Room;
