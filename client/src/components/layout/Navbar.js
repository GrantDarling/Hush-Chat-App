import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/hush_logo.png';

const Navbar = () => {

  return (
    <nav className='Navbar'>
      <NavLink exact to='/'>
        <img className='logo' src={Logo} alt='Logo' />
      </NavLink>
      <div className='links-container'>
        <div className='links'>
          <NavLink exact to='/'>HOME</NavLink><span> | </span>
          <NavLink exact to='/lobby'>LOBBY</NavLink><span> | </span>
          <NavLink exact to='/room' >NEW ROOM</NavLink>
        </div>
        <div className='tagline'>
          the only chat app that doesn't care enough to track you.
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
