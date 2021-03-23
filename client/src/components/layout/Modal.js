import React from 'react';
import { NavLink } from 'react-router-dom';

const Modal = ({ children, toggleModal, isOpen }) => {
  
  isOpen ? console.log('Modal is open.') : console.log('Modal is closed.')

  return (
    <section className={isOpen ? 'modal-backdrop' : 'display-none'}>
      <div className='modal'>
        <div className='modal-header'></div>
        <button className='modal-button' onClick={toggleModal}></button><NavLink to='/'></NavLink>
          {children}
        <div className='modal-footer'></div>
      </div>
    </section>
  );
};

export default Modal;
