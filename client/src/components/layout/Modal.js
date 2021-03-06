import React from 'react';

const Modal = ({ closeModal, children }) => {
  return (
    <section className='modal-backdrop'>
      <div className='modal'>
        <button className='modal-button' onClick={closeModal}>X</button>
        {children}
      </div>
    </section>
  );
};

export default Modal;
