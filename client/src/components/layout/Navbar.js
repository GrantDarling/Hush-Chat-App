import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/hush_logo.png';
import Toggle from '../logical/Toggle';
import Modal from '../layout/Modal';
import CreateRoom from '../layout/CreateRoom';

const Navbar = () => {
  const [isOpen, toggle] = Toggle();

  return (
    <nav className='navbar'>
      <NavLink exact to='/'>
        <img className='navbar__logo' src={Logo} alt='Logo' />
      </NavLink>
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
          <NavLink to='/room' onClick={toggle}>
            NEW ROOM
          </NavLink>
        </div>
        <div className='navbar__tagline'>
          the only chat app that doesn't care enough to track you.
        </div>
      </div>

      {isOpen ? (
        <Modal closeModal={toggle}><CreateRoom closeModal={toggle.bind(this)} /></Modal>
      ) : null}
    </nav>
  );
};

export default Navbar;
