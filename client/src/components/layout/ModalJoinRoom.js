import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const ModalJoinRoom = ({ room, lobby }) => {
  const [redirect, setRedirect] = useState(false);
  const [guestUserName, setGuestUserName] = useState('');
  const [allowGuestVideo, setAllowGuestVideo] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    
    setRedirect(true);
  };

    const onChange = (e) => {
        setGuestUserName(e.target.value);
    }

    const onChange2 = (e) => {
        setAllowGuestVideo(e.target.value);
    }

  useEffect(() => {
  }, []);

  return (
    <div className='modal-child'>
      <h1>JOIN ROOM</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor='username'>Username: {guestUserName} </label>
        <input 
          type='text' 
          placeholder="Username"
          name='guestUserName' 
          value={guestUserName} 
          onChange={onChange} 
          // required
           /> 

        <label htmlFor='allowVideo'>Allow Video?</label> <br/>
        <label htmlFor='allowVideo'>Allow</label>
        <input 
          type="radio" 
          id="allowed" 
          className="checkmark" 
          name="allowGuestVideo" 
          value="true" 
          onChange={onChange2} 
          // required
        />

        <label htmlFor='allowVideo'>Do Not Allow</label>
        <input 
          type="radio" 
          id="not-allowed" 
          className="checkmark" 
          name="allowGuestVideo" 
          value="" 
          onChange={onChange2} 
          // required
        />

        <button type="submit" name='submit'>JOIN</button>
      </form> 
      { redirect ? <Redirect exact to={{
      pathname:'/room',
      state: { joinRoomName: room[0],
                host: room[1],
                rooms: lobby,
              guestUserName: guestUserName,
              allowGuestVideo: allowGuestVideo }  
    }} 
    />
    : '' }
    </div>
  );
};

export default ModalJoinRoom;
