import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='landing__buttons'>
        <button className='landing__button landing__button--create'>
          <Link to='/room'>CREATE ROOM</Link>
        </button>
        <button className='landing__button landing__button--join'>
          <Link to='/lobby'>JOIN ROOM</Link>
        </button>
      </div>
    </section>
  );
};

export default Landing;
