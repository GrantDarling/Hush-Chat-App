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
        }

    }, [socket, postMessage, hasRun]);
}

export default useOnSocket;