import { useEffect } from 'react';

function useCreateRoom(socket, room, setRoom, isCreated, getUserVideo, video, displayUserMedia) {

    useEffect(() => {
        if(isCreated) {
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            displayUserMedia(socket, getUserVideo);
            setRoom({...room, isCreated: false});
        }
    }, [isCreated, socket, room, setRoom, getUserVideo, video, displayUserMedia]);
}

export default useCreateRoom;