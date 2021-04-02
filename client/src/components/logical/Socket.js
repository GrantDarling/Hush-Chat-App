import Helpers from './Helpers';
// import useSound from 'use-sound';
// import boop from '../../sounds/boop.mp3';


const Socket = () => {
  const [CreateElement] = Helpers();
  // const [emitBoop] = useSound(
  //   boop,
  //   { volume: 0.25 }
  // );

    const postMessage = (emittedUser, emittedMessage, userClass, audio) => {
        const chatContainer = document.getElementById('chat');
        const message = CreateElement('div', { className: `${userClass}`});
        const sender = CreateElement('h3', { innerHTML: `@${emittedUser}` });
        const text = CreateElement('p', { innerHTML: `${emittedMessage}` });

        message.appendChild(sender);
        message.appendChild(text);

        chatContainer.appendChild(message);
        chatContainer.scrollTop = (chatContainer.scrollHeight - chatContainer.clientHeight);
        
       // if(audio) emitBoop();
    };
    return [postMessage];
}

export default Socket;