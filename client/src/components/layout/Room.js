import React from 'react';

const Room = () => {
    // Fix the CSS class names 
  return (
    <section className='room-container'> {// Make this class *Room 
    }
        <div className='chatbox'>
            <div className='chatbox__text-view'>
                <ul id="chatbox__text-view">
                    <li className='chatbox__text-message'>This is a sample message</li>
                </ul>
            </div>
            <form className='chatbox__input'>
                <input type="text" name='message' />
                <button type='submit'>Send</button>
            </form>
        </div>
        <div className='videos'>
            <video className='room__your-video' />
            <video className='room__guest-video' />
        </div>
    </section>
  );
};

export default Room;
