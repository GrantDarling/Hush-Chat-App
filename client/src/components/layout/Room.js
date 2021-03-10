import React, {useEffect, useState} from 'react';
import Toggle from '../logical/Toggle';
import Modal from '../layout/Modal';
import CreateRoom from '../layout/CreateRoom';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');


const Room = (props) => {
    const [isOpen, toggle] = Toggle();

    const [roomData, setRoomData] = useState({
      username: '',
      room: '',
      message: '',
      chatCreated: false,
      rooms: []
    });

    const { username, room, message, chatCreated, rooms } = roomData;

    const onChange = (e) => {
      setRoomData({
        ...roomData,
        [e.target.name]: e.target.value
      });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        // alert(message)

        socket.emit('chat message', message, room);

        socket.on('message', function(data) {
            console.log('Incoming message:', data);
        });

        setRoomData({
            ...roomData,
            message: ''
        });
    }

    socket.on('connection', (id) => {
        console.log(rooms)

    });

            socket.on('chat message', function (message, id) {
        const chatbox = document.querySelector('#chatbox__text-view');
        const textMessage = document.createElement("li");
        textMessage.appendChild(document.createTextNode(id[0] + ' Says: ' + message));
        chatbox.appendChild(textMessage);
        console.log(`${id}: ${message}`);
    });




    if(chatCreated) {
        socket.emit('create', room);
        console.log('CHAT CREATED')

        setRoomData({
            ...roomData,
            chatCreated: false
        });

    }

    useEffect(() => {

        if(props.location.aboutProps) {
            socket.emit('create', props.location.aboutProps.name);
            
            //alert(props.location.aboutProps.name)
            setRoomData({
                ...roomData,
                room: props.location.aboutProps.name,
                chatCreated: false
            });

    } else {
        toggle();
    }


        if (!room) {
            //toggle();
        }

        //socket.emit('create', room);

        //console.log(`${room} was created.`);

    }, []);

    socket.on('message', function(data) {
   console.log('Incoming message:', data);
});

  return (
    <section className='room-container'>
        <h1>Name: {username} <br /> Room: {room}</h1>
        <div className='room-container'>
            <div className='chatbox'>
                <div className='chatbox__text-view'>
                    <ul id="chatbox__text-view">
                        <li className='chatbox__text-message'>This is a sample message</li>
                    </ul>
                </div>
                <form className='chatbox__input' onSubmit={onSubmit}>
                    <input type="text" name='message' value={message} onChange={onChange} />
                    <button type='submit' onSubmit={onSubmit}>Send</button>
                </form>
            </div>
            <div className='videos'>
                <video className='room__your-video' />
                <video className='room__guest-video' />
            </div>
        </div>

        {isOpen ? (
            <Modal closeModal={toggle} roomData={roomData} ><CreateRoom closeModal={toggle.bind(this)} roomData={roomData} setRoomData={setRoomData} /></Modal>
        ) : null}
    </section>
  );
};

export default Room;
