import React from 'react';
import { NavLink } from 'react-router-dom';
import Modal from './Modal';
import JoinRoom from './ModalJoinRoom';

const Lobby = () => {
  return (
    <section className='Lobby'>
       {/* No Chatrooms */}
      {/* <div class="chatrooms--none">
        <h1>Currently no chatrooms available.</h1>
      </div> */}

      {/* Chatroom unlocked */}
      <div className='chatrooms'>
        <div className='chatroom'>
          <div className='details-container'>
            <h3><small>Room Name: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h4>Capacity: 1/2</h4>
          </div>
          <NavLink exact to='/lobby' className='join' onClick={toggleModal} >JOIN</NavLink>
        </div>

      {/* Chatroom locked */}
        <div className='chatroom--locked'>
          <div className='details-container'>
            <h3><small>Room Name: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h4>Capacity: 2/2</h4>
          </div>
          <div className='join'>FULL</div>
        </div>

      {/* Sample Third */}
        <div className='chatroom'>
          <div className='details-container'>
            <h3><small>Room Name: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h4>Capacity: 1/2</h4>
          </div>
          <div className='join'>JOIN</div>
        </div> 
      </div>

      <Modal>
        <JoinRoom />
      </Modal>
    </section>
  );
};

export default Lobby;
