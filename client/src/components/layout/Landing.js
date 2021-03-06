import React from 'react';
import { Link } from 'react-router-dom';
import Toggle from '../logical/Toggle';
import Modal from '../layout/Modal';
import CreateRoom from '../layout/CreateRoom';

const Landing = () => {
  const [isOpen, toggle] = Toggle();

  return (
    <section className='landing'>
      <div className='landing__buttons'>
        <button className='landing__button landing__button--create'>
          <Link to='/room'>CREATE ROOM</Link>
        </button>
        <button onClick={toggle} className='landing__button landing__button--join'>
          <a href='#'>JOIN ROOM</a>
        </button>
      </div>

      {isOpen ? (
      <Modal closeModal={toggle}><CreateRoom /></Modal>
      ) : null}
    </section>
  );
};

export default Landing;
