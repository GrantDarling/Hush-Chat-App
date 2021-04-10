import Modal from './Modal';
import JoinRoom from './ModalJoinRoom';
import LobbyLogic from '../logical/Lobby';

const Lobby = ({ socket }) => {
  const [onClick, lobby, room, isOpen, toggleModal] = LobbyLogic(socket);


  return (
    <section className='Lobby'>
      <div className='chatrooms'>

        {lobby.length > 0 ? lobby.map((room) => 
          (<div key={room.name} className={room.users.length < 2 ? 'chatroom' : 'chatroom--locked'}>
              <div className='details-container'>
                <h3><small>Room Name: </small>{room.name}</h3>
                <h3><small>Host: </small>{room.host.name}</h3>
                { room.users.length < 2 
                  ? <h4>Capacity: {room.users.length}/2</h4> 
                  : <div className='join'>FULL</div> 
                }
              </div>
                { room.users.length < 2 
                  ? <button className='join' onClick={() => onClick(room)}>JOIN</button>
                  : "" 
                }
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
