import React from 'react';

const Lobby = () => {
  return (
    <section className='Lobby'>
       {/* No Chatrooms */}
      {/* <div class="chatrooms--none">
        <h1>Currently no chatrooms available.</h1>
      </div> */}

      {/* Chatroom unlocked */}
      <div className='chatrooms'>
        <div className='chatroom'>
          <div className='details-container'>
            <h3><small>Chatroom: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h3><small>Capacity: </small>1/2</h3>
          </div>
          <a href='/lobby' className='join'>JOIN</a>
        </div>

      {/* Chatroom locked */}
        <div className='chatroom--locked'>
          <div className='details-container'>
            <h3><small>Chatroom: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h3><small>Capacity: </small>1/2</h3>
          </div>
          <div className='join'>FULL</div>
        </div>

      {/* Sample Third */}
        <div className='chatroom'>
          <div className='details-container'>
            <h3><small>Chatroom: </small>Cool Kids</h3>
            <h3><small>Host: </small>Kyle88</h3>
            <h3><small>Capacity: </small>1/2</h3>
          </div>
          <div className='join'>JOIN</div>
        </div> 
      </div>
    </section>
  );
};

export default Lobby;
