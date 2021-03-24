import React, { useEffect, useState, useRef } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal'

const Room = () => {
    const [isOpen, toggleModal] = ModalSwitch();
    const roomExists = useRef(false);

    useEffect(() => {
        if(!roomExists.current) {
            roomExists.current = true;
            toggleModal();
        }
    },[toggleModal, roomExists])
    
    const [room, setRoom] = useState({
        roomName: '',
        hostUsername: '',
        allowVideo: ''
    })

    const { roomName, hostUsername, allowVideo } = room;

    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {roomName}</h3>
            <div className='chatbox'> 
                <div className='chat'>
                    <div className='messages'>
                        <ul className="message-emit">
                            <li>'{roomName}' group created...</li>
                            <li>@{hostUsername} has entered the chat.</li>
                            <li>@LukeSkywalker has entered the chat.</li>
                        </ul>
                        <div className='message-host'>
                            <h3>@{hostUsername}</h3>
                            <p>Hey man!</p>
                        </div>
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
                        <div className='message-host'>
                            <h3>@{hostUsername}</h3>
                            <p>This is an example of a super 
                                Long message that I hope isn’t 
                                Too long but it needed to be 
                                done !
                            </p>
                        </div>
                    </div>
                    <form className='input-controller'>
                        <input type="text" name='message' />
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
                    <CreateRoom roomName={roomName} hostUsername={hostUsername} allowVideo={allowVideo} setRoom={setRoom} room={room} toggleModal={toggleModal} />
                </Modal>

            </div>
        </section>
    );
};

export default Room;
