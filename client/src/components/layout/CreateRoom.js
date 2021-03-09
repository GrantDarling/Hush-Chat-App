import React from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');


const CreateRoom = ({ closeModal, roomData, setRoomData }) => {

  const { username, room } = roomData;


    const onChange = (e) => {
      setRoomData({
        ...roomData,
        [e.target.name]: e.target.value
      });
    }

  const onSubmit = (e) => {
    e.preventDefault();
    closeModal();
    createRoom();
  };

  const createRoom = () => {
    socket.emit('create', room);

    console.log(`${room} was created.`);
  }

  return (
    <div className='create-room'>
      <h1>CREATE ROOM</h1>
      <form onSubmit={onSubmit}>

        <label htmlFor='room'>Room Title</label>
        <input 
          type='text' 
          name='room'
          placeholder='Room'
          value={room}
          onChange={onChange}
          required /> 

        <label onClick={closeModal} htmlFor='username'>Username</label>
        <input 
          type='text' 
          name='username'
          placeholder='Username'
          value={username}
          onChange={onChange}
          required /> 

          <button type="submit" name='submit'>
            Create room
          </button>
      </form>
    </div>
  );
};

export default CreateRoom;
