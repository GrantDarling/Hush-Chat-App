import React from 'react';
import { Link } from 'react-router-dom';
import Toggle from '../logical/Toggle';
import CreateRoomModal from '../layout/CreateRoomModal';

const Landing = () => {
  const [isOpen, toggle] = Toggle();

  return (
    <section className='landing'>
      <div className='landing__buttons'>
        <button className='landing__button landing__button--create'>
          <Link to='/room'>CREATE ROOM</Link>
        </button>
        <button
          onClick={toggle}
          className='landing__button landing__button--join'
        >
          JOIN ROOM
        </button>
        {isOpen ? <CreateRoomModal toggle={toggle} /> : null}
      </div>
    </section>
  );
};

export default Landing;
