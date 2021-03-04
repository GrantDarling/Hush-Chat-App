import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../images/hush_logo.png';

let Navbar = () => {
  console.log(Logo);
  return (
    <nav>
      <div className='navbar__logo-container'>
        <Link to='/'>
          <img className='navbar__logo' src={Logo} alt='Logo' />;
        </Link>
      </div>
      <div className='navbar__items-container'>
        <div className='navbar__items'>
          <Link to='/'>HOME</Link>
          <span> | </span>
          <Link to='/lobby'>LOBBY</Link>
          <span> | </span>
          <Link to='/room'>NEW ROOM</Link>
        </div>
        <div className='navbar__items'>
          the only chat app that doesn't care enough to track you.
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
