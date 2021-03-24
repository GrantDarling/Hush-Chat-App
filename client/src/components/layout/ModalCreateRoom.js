import React, { useState } from 'react';

const ModalCreateRoom = ({ roomName, hostUsername, allowVideo, setRoom, room, toggleModal }) => {

  const onChange = (e) => {
      setRoom({
      ...room,
      [e.target.name]: e.target.value
      })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    toggleModal();
  }

  return (
    <div className='modal-child'>
      <h1>CREATE ROOM</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor='roomName'>Room Name: </label>
        <input type='text' placeholder="Room Name" name='roomName' value={roomName} onChange={onChange} /> 
        <label htmlFor='hostUsername'>Username: </label>
        <input type='text' placeholder="Username" name='hostUsername' value={hostUsername} onChange={onChange} /> 
        <label htmlFor='allowVideo'>Allow Video? {allowVideo}</label> <br/>
        <label htmlFor='allowVideo'>Allow</label>
        <input type="radio" id="allowed" className="checkmark" name="allowVideo" value="true" onChange={onChange} />
        <label htmlFor='allowVideo'>Do Not Allow</label>
        <input type="radio" id="not-allowed" className="checkmark" name="allowVideo" value="" onChange={onChange} />

        <button type="submit" name='submit'>CREATE</button>
      </form> 
    </div>
  );
};

export default ModalCreateRoom;
