import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const ModalJoinRoom = ({ room, lobby }) => {
  const [redirect, setRedirect] = useState(false);
  const [other, setOther] = useState('');
  const [allowOtherVideo, setAllowOtherVideo] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setRedirect(true);
  };

  const onChangeGuest = (e) => setOther(e.target.value);
  const onChangeVideo = (e) => setAllowOtherVideo(e.target.value)

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

        <label htmlFor='allowVideo'>Allow Video?</label> <br/>
        <label htmlFor='allowVideo'>Allow</label>
        <input 
          type="radio" 
          id="allowed" 
          className="checkmark" 
          name="allowGuestVideo" 
          value="true" 
          onChange={onChangeVideo} 
          required
        />

        <label htmlFor='allowVideo'>Do Not Allow</label>
        <input 
          type="radio" 
          id="not-allowed" 
          className="checkmark" 
          name="allowGuestVideo" 
          value="" 
          onChange={onChangeVideo} 
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
