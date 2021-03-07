import React from 'react';
import { NavLink } from 'react-router-dom';
import Toggle from '../logical/Toggle';
import Modal from '../layout/Modal';
import CreateRoom from '../layout/CreateRoom';

const Landing = () => {
  const [isOpen, toggle] = Toggle();

  return (
    <section className='landing'>
      <div className='landing__buttons'>
        <button onClick={toggle} className='landing__button landing__button--create'>
          <NavLink to='/'>CREATE ROOM</NavLink>
        </button>
        <button className='landing__button landing__button--join'>
          <NavLink to='/room'>JOIN ROOM</NavLink>
        </button>
      </div>

      {isOpen ? (
      <Modal closeModal={toggle}><CreateRoom closeModal={toggle.bind(this)} /></Modal>
      ) : null}
    </section>
  );
};

export default Landing;
