import React from 'react';

const ModalCreateRoom = () => {
  return (
    <div className='modal-child'>
      <h1>JOIN ROOM</h1>
      <form>
        <label htmlFor='username'>Username:</label>
        <input placeholder="Username" /> 
        <label htmlFor='video'>Allow Video?</label>
        <input type="checkbox" className="checkmark" />
        <button type="submit" name='submit'>JOIN</button>
      </form> 
    </div>
  );
};

export default ModalCreateRoom;
