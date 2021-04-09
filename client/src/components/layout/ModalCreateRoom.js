import React from 'react';
import ModalCreateRoomLogic from '../logical/ModalCreateRoom';

const ModalCreateRoom = ({ onChange, toggleModal, setRoom, room }) => {
  const [onSubmit] = ModalCreateRoomLogic(toggleModal, setRoom, room);

  return (
    <div className='modal-child'>
      <h1>CREATE ROOM</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor='name'>Room Name:</label>
        <input 
          type='text' 
          placeholder="Room Name" 
          name='name' 
          value={room.name} 
          onChange={onChange} 
          required
        /> 
        <label htmlFor='host'>Username:</label>
        <input 
          type='text' 
          placeholder="Username" 
          name='host' 
          target-child='name'
          value={room.host.name} 
          onChange={onChange} 
          required
        /> 
        <label htmlFor='allowVideo'>Allow Video?</label> <br/>
        <label htmlFor='allowVideo'>Allow</label>
        <input 
          type="radio" 
          id="allowed" 
          className="checkmark" 
          name="host" 
          target-child='allowVideo'
          value="true" 
          onChange={onChange} 
          required
        />
        <label htmlFor='allowVideo'>Do Not Allow</label>
        <input 
          type="radio" 
          id="not-allowed" 
          className="checkmark" 
          name="host" 
          target-child='allowVideo'
          value="" 
          onChange={onChange} 
          required
        />
        <button type="submit" name='submit'>CREATE</button>
      </form> 
    </div>
  );
};

export default ModalCreateRoom;
