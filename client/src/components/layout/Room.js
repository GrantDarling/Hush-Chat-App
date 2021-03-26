import React, { useEffect, useState, useRef } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const Room = () => {
    const [isOpen, toggleModal] = ModalSwitch();
    const roomExists = useRef(false);

    const [room, setRoom] = useState({
        roomName: '',
        hostUsername: '',
        allowVideo: '',
        chatMessage: '',
        roomCreated: false
    })
        
    const { roomName, hostUsername, allowVideo, chatMessage, roomCreated } = room;

    useEffect(() => {
        if(roomCreated) {
            socket.emit('create', roomName);

            setRoom({
                ...room,
                roomCreated: false
            });
        }

    },[roomName, roomCreated, room])

    useEffect(() => {
        if(!roomExists.current) {
            roomExists.current = true;
            toggleModal();
        }

        socket.on('chat message', (message) => {
            console.log(message);
            let chatContainer = document.getElementById('chat');
            let messageContainer = document.createElement('div');
            let messageSender = document.createElement('h3');
            let messageTextContainer = document.createElement('p');

            messageContainer.classList.add('message-host');
            messageContainer.appendChild(messageSender);
            messageSender.innerHTML = `@${hostUsername}`;
            messageContainer.appendChild(messageTextContainer);
            messageTextContainer.innerHTML = `${message}`;

            chatContainer.appendChild(messageContainer);
            chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
        });
    
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
        
        socket.emit('chat message', chatMessage, roomName);

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
                        <div className='message-guest'>
                            <h3>@lukeskywalker</h3>
                            <p>Hey man!</p>
                        </div>
                        <div className='message-guest'>
                            <h3>@lukeskywalker</h3>
                            <p>This is an example of a super 
                                Long message that I hope isn’t 
                                Too long but it needed to be 
                                done !
                            </p>
                        </div>
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
                        <h4 className='username' >@LukeSkywalker</h4>
                        <img src={GuestPlaceholder} alt="Guest Placeholder"/>
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
