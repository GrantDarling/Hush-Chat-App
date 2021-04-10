import { useEffect, useState, useCallback } from 'react';

function useJoinRoom(socket, state, room, setRoom) {
    const [hasRun, setHasRun] = useState(false);

    const setJoinedRoom = useCallback((state) => {
        setRoom({ 
            ...room, 
            name: state.name,
            host: {
                name: state.other,
                allowVideo: state.allowOtherVideo,
            },
            guest: {
                name: state.host,
                allowVideo: state.allowVideo,
            },
            isCreated: false,
            isHost: false,
            hasJoined: true
        });
    }, [setRoom, room]);


    useEffect(() => {
        if (state.hasJoined && !hasRun) {
            setJoinedRoom(state);
            socket.emit('join room', state.name);
            socket.emit('broadcast room state', state.name, state);
            setHasRun(true);
        }    
    }, [setJoinedRoom, socket, state, hasRun]);
}

export default useJoinRoom;