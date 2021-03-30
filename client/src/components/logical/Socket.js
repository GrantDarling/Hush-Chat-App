import Helpers from './Helpers';

const Socket = () => {
  const [CreateElement] = Helpers();

    const emitMessage = (emittedUser, emittedMessage) => {
        const chatContainer = document.getElementById('chat');
        const message = CreateElement('div', { className: 'message-guest'});
        const sender = CreateElement('h3', { innerHTML: `@${emittedUser}` });
        const text = CreateElement('p', { innerHTML: `${emittedMessage}` });

        message.appendChild(sender);
        message.appendChild(text);

        chatContainer.appendChild(message);
        chatContainer.scrollTop = (chatContainer.scrollHeight - chatContainer.clientHeight);
    };

    return [emitMessage];
}

export default Socket;