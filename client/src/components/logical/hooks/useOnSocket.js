import { useEffect } from 'react';
import Socket from '../Socket';

function useOnSocket(socket) {
    const [postMessage] = Socket();

    useEffect(() => {
        socket.on('message', (guest, message, messageClass, audio) => {
            postMessage(guest, message, messageClass, audio)
        });


    }, [socket]);
}

export default useOnSocket;