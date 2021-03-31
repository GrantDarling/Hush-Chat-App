import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import JoinRoom from './ModalJoinRoom';
import ModalSwitch from '../logical/Modal';

const Lobby = ({socket}) => {
  const [isOpen, toggleModal] = ModalSwitch();
  const [lobby, setLobby] = useState([]);
  const [room, setRoom] = useState({});

  const onClick = (chosenRoom) => {
    setRoom(chosenRoom);
    toggleModal();
  }

  useEffect(() => {
    socket.on('get rooms', (rooms) => setLobby(rooms));
    socket.emit('leave all rooms');
    socket.emit('get rooms');

    return () => {}
  }, [socket]);
  
  return (
    <section className='Lobby'>
      <div className='chatrooms'>

        {lobby.length > 0 ? lobby.map((room) => 
          (<div key={room.name} className={room.users.length < 2 ? 'chatroom' : 'chatroom--locked'}>
              <div className='details-container'>
                <h3>
                  <small>Room Name: </small>
                  {room.name}
                </h3>
                <h3>
                  <small>Host: </small>
                  {room.host.name}
                </h3>
                { room.users.length < 2 
                  ? <h4>Capacity: {room.users.length}/2</h4> 
                  : <div className='join'>FULL</div> 
                }
              </div>
              <button className='join' onClick={() => onClick(room)}>JOIN</button>
            </div>))
            : 
            (<div className="chatrooms--none">
              <h1>Currently no chatrooms available.</h1>
            </div>)
        }

        <Modal isOpen={isOpen} toggleModal={toggleModal} >
          <JoinRoom room={room} lobby={lobby} />
        </Modal>

      </div>
    </section>
    )
};

export default Lobby;
