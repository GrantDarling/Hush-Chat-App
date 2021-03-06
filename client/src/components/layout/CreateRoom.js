import React from 'react';

const CreateRoom = ({ closeModal, children }) => {
  return (
    <div className='create-room'>
      This is a modal
      <input type='text' />
      <input type='text' />
    </div>
  );
};

export default CreateRoom;
