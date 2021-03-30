import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';


const Room = ({ state, socket }) => {
    const [isOpen, toggleModal] = ModalSwitch();
    // Initialize room state
    const [room, setRoom] = useState({
        name: '',
        host: '',
        other: '',
        allowVideo: '',
        allowGuestVideo: '',
        chatMessage: '',
        roomCreated: false,
        prevUrl: window.location.href,
        hostCreatedMe: true
    })

    const { name, host, allowVideo, chatMessage, roomCreated, other, allowGuestVideo, prevUrl, hostCreatedMe } = room;

    useEffect(() => {
        if(roomCreated) {

            socket.emit('create room', name, host, allowVideo);
            socket.emit('join room', name);

            setRoom({ 
                ...room, 
                roomCreated: false,
                host: host,
                allowVideo: allowVideo,
                prevUrl: window.location.href,
                hostCreatedMe: true
            });
        }

        return () => {}; 
    },[name, host, roomCreated, room, socket, allowVideo])


    useEffect(() => {
                socket.on('host left', (id) => {
                    // console.log('host ' + id + 'left')
                    // console.log('room has been removed');
                    setRoom({
                        ...room,
                        name: state.joinRoomName,
                        other: state.host,
                        allowVideo: state.allowOtherVideo,
                        allowGuestVideo: state.allowVideo,
                        host: state.other
                    })
                });

       // console.log('allowVideo: ' + allowVideo);
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
                allowGuestVideo: state.allowVideo,
                host: state.other,
                hostCreatedMe: state.hostCreatedMe
            });
            // console.log('but im set to: ' + hostCreatedMe)
            socket.emit('refesh clients', state.joinRoomName, state, allowVideo);
            socket.emit('join room', state.joinRoomName);
            }
        }

        socket.on('refesh clients', (state, roomStateVideo) => {
            setRoom({ 
                ...room, 
                name: state.joinRoomName,
                other: state.other,
                allowVideo: state.allowVideo,
                allowGuestVideo: state.allowOtherVideo,
                host: state.host,
                hostDidntCreatedMe: true
            });
        })

        return (() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
    const unMountme = () => {
        // console.log('unmounted!!!' + name);
        socket.emit('close room', name);
    };    

        // console.log('PrevIRL: ' + prevUrl)
        // console.log('hostCreatedMe ' + hostCreatedMe);
        return function cleanup() {
            let newUrl = window.location.href;
            if (prevUrl !== newUrl && hostCreatedMe) {
                unMountme();
                
            }


        }
    }, [name, hostCreatedMe, prevUrl, socket]);


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
