import { useEffect, useState, useCallback } from 'react';

function useJoinRoom(socket, state, room, setRoom, videoElement2, onWebRTC, peerConnection, video2, displayUserMedia) {
    const [hasRun, setHasRun] = useState(false);

    const setJoinedRoom = useCallback((state) => {
        setRoom({ 
            ...room, 
            name: state.name,
            host: {
                name: state.host,
                allowVideo: state.allowVideo,
            },
            guest: {
                name: state.other,
                allowVideo: state.allowOtherVideo,
            },
            isCreated: false,
            isHost: false,
            hasJoined: true
        });
    }, [setRoom, room]);


    useEffect(() => {
        if (state.hasJoined && !hasRun) {
            console.log('running userHasJoinedFunc...');
            setJoinedRoom(state);
            socket.emit('join room', state.name);
            socket.emit('broadcast room state', state.name, state);
            setHasRun(true);

            console.log('running otherFunc...');
            socket.emit("watcher");
            console.log('trying to connect...');
            displayUserMedia(socket, videoElement2);
            onWebRTC(videoElement2, peerConnection, video2);
        }    
    }, [displayUserMedia, onWebRTC, peerConnection, setJoinedRoom, socket, state, hasRun, video2, videoElement2]);
}

export default useJoinRoom;