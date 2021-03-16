import React from 'react';
import { NavLink } from 'react-router-dom';

const Modal = ({ closeModal, children }) => {
  return (
    <section className='modal-backdrop'>
      <div className='modal'>
        <div className='modal-header'></div>
        <button className='modal-button' onClick={closeModal}></button><NavLink to='/'></NavLink>
        {children}
        <div className='modal-footer'></div>
      </div>
    </section>
  );
};

export default Modal;
