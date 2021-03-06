import React from 'react';

const CreateRoomModal = ({ toggle }) => {
  return (
    <section className='create-room-modal'>
      <button onClick={toggle}>click me</button>
    </section>
  );
};

export default CreateRoomModal;
