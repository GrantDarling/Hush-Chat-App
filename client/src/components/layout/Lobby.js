import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from './Modal';
import JoinRoom from './ModalJoinRoom';
import ModalSwitch from '../logical/Modal';

const Lobby = ({socket}) => {
  const [isOpen, toggleModal] = ModalSwitch(); // !!! potentially unused
  const [lobby, setLobby] = useState([]);

  useEffect(() => {

    // Get list of available rooms
    socket.on('get rooms', (activeRooms) => {
      console.log(activeRooms);
      setLobby(activeRooms)
    });
    socket.emit('get rooms');

  }, []);
  
  return (
    <section className='Lobby'>
      <div className='chatrooms'>

        {lobby.length > 0 ? lobby.map((room) => 
          (
            <div className='chatroom'>
              <div className='details-container'>
                <h3><small>Room Name: </small>{room}</h3>
                <h3><small>Host: </small>Kyle88</h3>
                <h4>Capacity: 1/2</h4>
              </div>
              <NavLink exact to='/room' className='join' onClick={toggleModal}>JOIN</NavLink>
            </div>
          )) : (
            <div class="chatrooms--none">
              <h1>Currently no chatrooms available.</h1>
            </div> 
          )
        }

        <Modal isOpen={isOpen} toggleModal={toggleModal}> {/* !!! potentially unused */}
          <JoinRoom />
        </Modal>

      </div>
    </section>
    )
};

export default Lobby;



       {/* No Chatrooms */}
      {/* <div class="chatrooms--none">
        <h1>Currently no chatrooms available.</h1>
      </div> */}

      {/* Chatroom unlocked */}
        {/* <div className='chatroom'>
          <div className='details-container'>
            <h3><small>Room Name: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h4>Capacity: 1/2</h4>
          </div>
          <NavLink exact to='/lobby' className='join' onClick={toggleModal}>JOIN</NavLink>
        </div> */}

      {/* Chatroom locked */}
        {/* <div className='chatroom--locked'>
          <div className='details-container'>
            <h3><small>Room Name: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h4>Capacity: 2/2</h4>
          </div>
          <div className='join'>FULL</div>
        </div> */}

      {/* Sample Third */}
        {/* <div className='chatroom'>
          <div className='details-container'>
            <h3><small>Room Name: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h4>Capacity: 1/2</h4>
          </div>
          <div className='join'>JOIN</div>
        </div> 
      </div> 
  ); */}