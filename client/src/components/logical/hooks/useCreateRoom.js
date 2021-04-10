import { useEffect } from 'react';

function useCreateRoom(socket, room, setRoom, isCreated) {

    useEffect(() => {
        if(isCreated) {
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setRoom({...room, isCreated: false});
        }
    }, [isCreated, socket, room, setRoom]);
}

export default useCreateRoom;