import React from 'react';
import { NavLink } from 'react-router-dom';

const Modal = ({ children, toggleModal, isOpen }) => {
  return (
    <section className={isOpen ? 'modal-backdrop' : 'display-none'}>
      <div className='modal'>
        <div className='modal-header'></div>
        <NavLink to='/' className='modal-button' onClick={toggleModal}></NavLink>
          {children}
        <div className='modal-footer'></div>
      </div>
    </section>
  );
};

export default Modal;
