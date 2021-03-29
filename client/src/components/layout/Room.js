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
        name: '',
        host: '',
        other: '',
        allowVideo: 'true',
        allowGuestVideo: '',
        chatMessage: '',
        roomCreated: false
    })
        
    const { name, host, allowVideo, chatMessage, roomCreated, other, allowGuestVideo } = room;

    useEffect(() => {
        
        if(roomCreated) {
            socket.emit('create room', name, host);
            socket.emit('join room', name);
            setRoom({ 
                ...room, 
                roomCreated: false,
                host: host,
                allowVideo: allowVideo
            });
        }

        return () => {}; 
    },[name, host, roomCreated, room, socket, allowVideo])

    useEffect(() => {
       console.log('allowVideo: ' + allowVideo);
        if(state) {
            if (!!state.newRoom) {
                toggleModal();
            }
           if (state.joinRoomName) {
            setRoom({ 
                ...room, 
                name: state.joinRoomName,
                other: state.host,
                allowVideo: state.allowOtherVideo,
                allowGuestVideo: allowVideo,
                host: state.other,
            });
            socket.emit('refesh clients', state.joinRoomName, state, allowVideo);
            socket.emit('join room', state.joinRoomName);
            }
        }

        socket.on('refesh clients', (state, roomStateVideo) => {
            setRoom({ 
                ...room, 
                name: state.joinRoomName,
                other: state.other,
                allowVideo: roomStateVideo,
                allowGuestVideo: state.allowOtherVideo,
                host: state.host
            });
        })
         return () => {}; 
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
        
        socket.emit('chat message', chatMessage, name, host);

        let chatContainer = document.getElementById('chat');
        let messageContainer = document.createElement('div');
        let messageSender = document.createElement('h3');
        let messageTextContainer = document.createElement('p');

        messageContainer.classList.add('message-host');
        messageContainer.appendChild(messageSender);
        messageSender.innerHTML = `@${host}`;
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
            <h3 className='Room-name'>Chatroom: {name}</h3>
            <div className='chatbox'> 
                <div className='chat'>
                    <div className='messages' id='chat'>
                        <ul className="message-emit">
                            <li>'{name}' group created...</li>
                            <li>@{host} has entered the chat.</li>
                            <li>@{other} has entered the chat.</li>
                        </ul>
                    </div>
                    <form className='input-controller' onSubmit={sendMessage}>
                        <input type="text" id='message-input' name='chatMessage' value={chatMessage} onChange={onChange} />
                        <button type='submit'>SEND</button>
                    </form>
                </div>
                <div className='videos'>
                    <div className='host'>
                        <h4 className='username' >@{host}</h4>
                        <img src={HostPlaceholder}  alt="Host Placeholder" className={ !!allowVideo ? 'active-video' : '' } />
                    </div>
                    <div className='guest'>
                        <h4 className='username' >@{other}</h4>
                        <img src={GuestPlaceholder} alt="Guest Placeholder" className={ !!allowGuestVideo ? 'active-video' : '' }/>
                    </div>

                    {/* <video className='host' />
                    <video className='guest' /> */}
                </div>

                <Modal isOpen={isOpen} toggleModal={toggleModal} >
                    <CreateRoom name={name} host={host} allowVideo={allowVideo} setRoom={setRoom} room={room} toggleModal={toggleModal} onChange={onChange} socket={socket} roomCreated={roomCreated} />
                </Modal>

            </div>
        </section>
    );
};

export default Room;
