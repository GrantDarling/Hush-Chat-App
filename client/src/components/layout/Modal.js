import React from 'react';
import { NavLink } from 'react-router-dom';

const Modal = ({ closeModal, children }) => {
  return (
    <section className='modal-backdrop'>
      <div className='modal'>
        <button className='modal-button' onClick={closeModal}>X</button><NavLink to='/'></NavLink>
        {children}
      </div>
    </section>
  );
};

export default Modal;
