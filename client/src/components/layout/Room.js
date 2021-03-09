import React, {useEffect, useState} from 'react';
import Toggle from '../logical/Toggle';
import Modal from '../layout/Modal';
import CreateRoom from '../layout/CreateRoom';

const Room = () => {
    const [isOpen, toggle] = Toggle();

    const [roomData, setRoomData] = useState({
      username: '',
      room: '',
      message: ''
    });

    const { username, room, message } = roomData;

    const onChange = (e) => {
      setRoomData({
        ...roomData,
        [e.target.name]: e.target.value
      });
    }


    const onSubmit = (e) => {
        e.preventDefault();

        const chatbox = document.querySelector('#chatbox__text-view');
        const textMessage = document.createElement("li");
        textMessage.appendChild(document.createTextNode(message));
        chatbox.appendChild(textMessage);

    setRoomData({
        ...roomData,
        message: ''
    });

    }


    useEffect(() => {
        //toggle()
    }, []);

  return (
    <section className='room'>
        <h1>Username: {username} | Room: {room}</h1>
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
