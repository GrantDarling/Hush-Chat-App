import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/hush_logo.png';

let Navbar = () => {
  console.log(Logo);
  return (
    <nav className='navbar'>
      <div className='navbar__logo-container'>
        <NavLink exact to='/'>
          <img className='navbar__logo' src={Logo} alt='Logo' />;
        </NavLink>
      </div>
      <div className='navbar__items-container'>
        <div className='navbar__items'>
          <NavLink exact to='/'>
            HOME
          </NavLink>
          <span> | </span>
          <NavLink exact to='/lobby'>
            LOBBY
          </NavLink>
          <span> | </span>
          <NavLink exact to='/room'>
            NEW ROOM
          </NavLink>
        </div>
        <div className='navbar__tagline'>
          the only chat app that doesn't care enough to track you.
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
