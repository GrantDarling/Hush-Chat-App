import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import JoinRoom from './ModalJoinRoom';
import ModalSwitch from '../logical/Modal';

const Lobby = ({socket}) => {
  const [isOpen, toggleModal] = ModalSwitch(); // !!! potentially unused
  const [lobby, setLobby] = useState([]);
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState(0);

  const onClick = (currRoom) => {
    console.log('current room is ' + currRoom)
    setRoom(currRoom);
    toggleModal();
  }

  useEffect(() => {
    socket.on('get rooms', (rooms) => {
      console.log(rooms);
      setLobby(rooms)
      setUsers()
    });
    socket.emit('leave all rooms');
    socket.emit('get rooms');

    return () => { setLobby([]) }; 
  }, [socket]);
  
  return (
    <section className='Lobby'>
      <div className='chatrooms'>

        {lobby.length > 0 ? lobby.map((room) => 
          (
            <div key={room.name} className={room.users.length < 2 ? 'chatroom' : 'chatroom--locked'}>
              <div className='details-container'>
                <h3><small>Room Name: </small>{room.name}</h3>
                <h3><small>Host: </small>{room.host}</h3>
                { room.users.length < 2 ? <h4>Capacity: {room.users.length}/2</h4> : <div className='join'>FULL{room.users.length}</div> }
              </div>
              <button className='join' onClick={() => onClick(room)}>JOIN</button>
            </div>
          )) : (
            <div className="chatrooms--none">
              <h1>Currently no chatrooms available.</h1>
            </div> 
          )
        }

        <Modal isOpen={isOpen} toggleModal={toggleModal} > {/* !!! potentially unused */}
          <JoinRoom room={room} lobby={lobby} />
        </Modal>

      </div>


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
    </section>
    )
};

export default Lobby;
