import { useEffect } from 'react';

function useCodeCleanup(socket, state, room, setRoom) {
    const {setURL, isHost} = room;

    useEffect(() => {
        
        return function cleanup() {
            let thisURL = window.location.href;
            if (thisURL !== setURL && isHost) {
                state.clickedNewRoom = 'true'
                socket.emit('close room', room.name);
                socket.emit('message', `${room.host.name} left the chat. Room closed...`, room.name, '', `message-general`, true);
                return setRoom({})
            }
        
            if(thisURL !== setURL) {
                socket.emit('message', `${room.host.name} left the chat.`, room.name, '', `message-general`, true);
                return setRoom({})
            };
        }
    }, [socket, room, state, isHost, setURL, setRoom]);
}

export default useCodeCleanup;