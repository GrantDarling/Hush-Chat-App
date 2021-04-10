import { useEffect, useState, useCallback } from 'react';

function useSetNewRoom(socket, state, toggleModal, setRoom, room) {
    const [hasRun, setHasRun] = useState(false);

    const setBroadcastRoomState = useCallback(() => {
        socket.on('broadcast room state', (state) => {
            setRoom({ 
                ...room, 
                name: state.name,
                host: {
                    name: state.host,
                    allowVideo: state.allowVideo
                },
                guest: {
                    name: state.other,
                    allowVideo: state.allowOtherVideo,
                }
            });
        });
    }, [setRoom, room, socket]);

    useEffect(() => {
        if (!!state.clickedNewRoom && !hasRun) {
            socket.emit('close all rooms by client id');
            toggleModal('open');
            setBroadcastRoomState();
            setHasRun(true);
        }      
    }, [socket, state, hasRun, toggleModal, setBroadcastRoomState]);
}

export default useSetNewRoom;