import { useEffect, useState } from 'react';
import Socket from '../Socket';

function useOnSocket(socket) {
    const [postMessage] = Socket();
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if(!hasRun) {
            socket.on('message', (guest, message, messageClass, audio) => {
                postMessage(guest, message, messageClass, audio)
            });
            setHasRun(true);

            socket.on("disconnect", () => {
                socket.emit('message', `${room.host.name} left the chat. Room closed...`, room.name, '', `message-general`, true);
            })
        }

    }, [socket, postMessage, hasRun]);
}

export default useOnSocket;