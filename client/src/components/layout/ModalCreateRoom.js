import React from 'react';

const ModalCreateRoom = ({ onChange, toggleModal, setRoom, room }) => {

  const onSubmit = (e) => {
    e.preventDefault();
    toggleModal();
    setRoom({ 
      ...room, 
      roomCreated: true 
    });
  }

  return (
    <div className='modal-child'>
      <h1>CREATE ROOM</h1>
      <form onSubmit={onSubmit}>

        <label htmlFor='roomName'>Room Name: </label>
        <input 
          type='text' 
          placeholder="Room Name" 
          name='roomName' 
          value={room.roomName} 
          onChange={onChange} 
          // required
        /> 

        <label htmlFor='hostUsername'>Username: </label>
        <input 
          type='text' 
          placeholder="Username" 
          name='hostUsername' 
          value={room.hostUsername} 
          onChange={onChange} 
          // required
        /> 
        
        <label htmlFor='allowVideo'>Allow Video? {room.allowVideo}</label> <br/>
        <label htmlFor='allowVideo'>Allow</label>
        <input 
          type="radio" 
          id="allowed" 
          className="checkmark" 
          name="allowVideo" 
          value="true" 
          onChange={onChange} 
          // required
        />

        <label htmlFor='allowVideo'>Do Not Allow</label>
        <input 
          type="radio" 
          id="not-allowed" 
          className="checkmark" 
          name="allowVideo" 
          value="" 
          onChange={onChange} 
          // required
        />

        <button type="submit" name='submit'>CREATE</button>
      </form> 
    </div>
  );
};

export default ModalCreateRoom;
