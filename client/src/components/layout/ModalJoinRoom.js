import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const ModalJoinRoom = ({ room, lobby }) => {
  const [redirect, setRedirect] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setRedirect(true);
  };

  useEffect(() => {
  }, []);

  return (
    <div className='modal-child'>
      <h1>JOIN ROOM</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor='username'>Username: {room} </label>
        <input placeholder="Username" /> 
        <label htmlFor='video'>Allow Video?</label>
        <input type="checkbox" className="checkmark" />
        <button type="submit" name='submit'>JOIN</button>
      </form> 
      { redirect ? <Redirect exact to={{
      pathname:'/room',
      state: { joinRoomName: room,
                rooms: lobby }  
    }} 
    />
    : '' }
    </div>
  );
};

export default ModalJoinRoom;
