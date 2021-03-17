import React from 'react';
// import Modal from './Modal';
// import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";

const Room = () => {
    // Fix the CSS class names 
  return (
    <section className='Room'>
        <h3 className='Room-name'>Chatroom: The Cool Kids</h3>
        <div className='chatbox'> 
            <div className='chat'>
                <div className='messages'>
                    <ul className="message-emit">
                        <li>'The Cool Kids' Group Created...</li>
                        <li>@Grant69 has entered the chat.</li>
                        <li>@LukeSkywalker has entered the chat.</li>
                    </ul>
                    <div className='message-host'>
                        <h3>@grantd16</h3>
                        <p>Hey man!</p>
                    </div>
                    <div className='message-guest'>
                        <h3>@lukeskywalker</h3>
                        <p>Hey man!</p>
                    </div>
                    <div className='message-guest'>
                        <h3>@lukeskywalker</h3>
                        <p>This is an example of a super 
                            Long message that I hope isn’t 
                            Too long but it needed to be 
                            done !
                        </p>
                    </div>
                    <div className='message-host'>
                        <h3>@lukeskywalker</h3>
                        <p>This is an example of a super 
                            Long message that I hope isn’t 
                            Too long but it needed to be 
                            done !
                        </p>
                    </div>
                </div>
                <form className='input-controller'>
                    <input type="text" name='message' />
                    <button type='submit'>SEND</button>
                </form>
            </div>
            <div className='videos'>
                <div className='host'>
                    <h4 className='username' >@Grant69</h4>
                    <img src={HostPlaceholder}  alt="Host Placeholder"/>
                </div>
                <div className='guest'>
                    <h4 className='username' >@LukeSkywalker</h4>
                    <img src={GuestPlaceholder} alt="Guest Placeholder"/>
                </div>

                {/* <video className='host' />
                <video className='guest' /> */}
            </div>

            {/* <Modal><CreateRoom /></Modal> */}
        </div>
    </section>
  );
};

export default Room;
