import React from 'react';

const ModalCreateRoom = () => {
  return (
    <div className='ModalCreateRoom'>
      <h1>CREATE ROOM</h1>
      <form>
        <label htmlFor='room'>Room</label>
        <input /> 
        <label htmlFor='username'>Your Name</label>
        <input /> 
        <button type="submit" name='submit'>Create room</button>
      </form>
    </div>
  );
};

export default ModalCreateRoom;
