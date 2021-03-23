import React from 'react';

const ModalCreateRoom = () => {
  return (
    <div className='modal-child'>
      <h1>CREATE ROOM</h1>
      <form>
        <label htmlFor='room'>Room Name:</label>
        <input placeholder="Room Name" /> 
        <label htmlFor='username'>Username:</label>
        <input placeholder="Username" /> 
        <label htmlFor='video'>Allow Video?</label>
        <input type="checkbox" className="checkmark" />
        <button type="submit" name='submit'>CREATE</button>
      </form> 
    </div>
  );
};

export default ModalCreateRoom;
