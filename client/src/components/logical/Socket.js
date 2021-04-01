import Helpers from './Helpers';

const Socket = () => {
  const [CreateElement] = Helpers();

    const postMessage = (emittedUser, emittedMessage, userClass) => {
        const chatContainer = document.getElementById('chat');
        const message = CreateElement('div', { className: `${userClass}`});
        const sender = CreateElement('h3', { innerHTML: `@${emittedUser}` });
        const text = CreateElement('p', { innerHTML: `${emittedMessage}` });

        message.appendChild(sender);
        message.appendChild(text);

        chatContainer.appendChild(message);
        chatContainer.scrollTop = (chatContainer.scrollHeight - chatContainer.clientHeight);
    };
    return [postMessage];
}

export default Socket;