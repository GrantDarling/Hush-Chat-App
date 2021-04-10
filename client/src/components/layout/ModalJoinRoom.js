import React from 'react';
import { Redirect } from 'react-router-dom';
import ModalJoinRoomLogic from '../logical/ModalJoinRoom';

const ModalJoinRoom = ({ room, lobby }) => {
  const [onSubmit, onChangeGuest, redirect, other, allowOtherVideo] = ModalJoinRoomLogic(room, lobby);
  
  return (
    <div className='modal-child'>
      <h1>JOIN ROOM</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor='username'>Username: </label>
        <input 
          type='text' 
          placeholder="Username"
          name='other' 
          value={other} 
          onChange={onChangeGuest} 
          required
           /> 

        <button type="submit" name='submit'>JOIN</button>
      </form> 
      { redirect ?
        <Redirect exact to=
            {{ pathname:'/room', state: {  
                name: room.name,
                host: room.host.name,
                allowVideo: room.host.allowVideo,
                other: other, 
                allowOtherVideo: allowOtherVideo ,
                hasJoined: true
              }  
            }} 
        /> : '' 
      }
    </div>
  );
};

export default ModalJoinRoom;
