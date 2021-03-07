import React from 'react';

const CreateRoom = ({ closeModal, children }) => {

    const onSubmit = (e) => {
    e.preventDefault();


  };

  return (
    <div className='create-room'>
      <h1>CREATE ROOM</h1>
      <form onSubmit={onSubmit}>
        <label>Room Title</label>
        <input type='text' />
        <label>Username</label>
        <input type='text' /> 
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;
