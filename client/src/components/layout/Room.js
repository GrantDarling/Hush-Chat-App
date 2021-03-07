import React from 'react';

const Room = () => {

  return (
    <section className='room'>
        <div className='chatbox'>
            <div className='chatbox__text-view'>
                <ul>
                    <li className='chatbox__text-message'>This is a sample message</li>
                </ul>
            </div>
            <div className='chatbox__input'>
                <input type="text"/>
                <button type='submit'>Send</button>
            </div>
        </div>
        <div className='videos'>
            <video className='room__your-video' />
            <video className='room__guest-video' />
        </div>
    </section>
  );
};

export default Room;
