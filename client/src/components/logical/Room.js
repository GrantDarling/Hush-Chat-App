import {useState, useRef, createRef, useCallback } from 'react';
import Socket from './Socket';
import webRTC from './webRTC';



const RoomLogic = (socket, state, toggleModal) => {
    const [postMessage] = Socket();
    const [room, setRoom] = useState({
        name: '',
        host: {
            name: '',
            allowVideo: '',
        },        
        guest: {
            name: '',
            allowVideo: ''
        },
        chatMessage: '',
        isCreated: false,
        isHost: true,
        hasJoined: false,
        setURL: window.location.href,
    });
    const { isCreated, setURL, isHost, chatMessage } = room;
    const videoElement = useRef(null);  
    const videoElement2 = useRef(null);    
    const video = useRef(); 
    const switcher = useRef(true);
    const video2 = useRef();  
    const peerConnection = createRef();
    const peerConnections = {};
    const config = {
        iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
    };   
    const [onWebRTC, displayUserMedia] = webRTC(socket, peerConnections, config);

    const setClientRooms = useCallback(() => {
        socket.on('refresh clients', (state) => {
            socket.emit("watcher");

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


    // Code cleanUp useEffect
    const cleanUpCode = useCallback(() => {
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
    }, [socket, room, state, isHost, setURL, setRoom]);

    const setLocalRoom = useCallback(() => {
        setRoom({ 
            ...room, 
            isCreated: false
        });
    }, [setRoom, room]);


    // roomWasCreated useEffect
    const roomWasCreated = useCallback(() => {
        if(isCreated) {
            if(switcher) {
                onWebRTC(videoElement, peerConnection, video);
                switcher.current = false;
            }

            displayUserMedia(socket, videoElement);
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setLocalRoom(setRoom, room);
        }
    }, [isCreated, switcher, onWebRTC, socket, displayUserMedia, peerConnection, room, setLocalRoom, setRoom, videoElement, video]);

    // Clicked new room
    const clickedNewRoom = useCallback(() => {
        if (!!state.clickedNewRoom) {
            toggleModal();
            setClientRooms();

            state.clickedNewRoom = '';
        }    
    }, [toggleModal, state, setClientRooms]);


    const setJoinedRoom = (state) => {
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
    }

    const onChange = (e) => {
        return (
            e.target.name === 'host' 
            ? setRoom({ ...room, [e.target.name] : { ...room.host, [e.target.getAttribute("target-child")]: e.target.value }})
            : setRoom({ ...room, [e.target.name]: e.target.value })
        )
    }

    const sendMessage = (e) => {
        e.preventDefault(); 
        postMessage(room.host.name, chatMessage, `message-host`, false);
        socket.emit('message', chatMessage, room.name, room.host.name, `message-guest`, true);
        setRoom({ ...room, chatMessage: '' });
    };
    return [setJoinedRoom, onChange, sendMessage, room, setRoom, videoElement, videoElement2, video, switcher, video2, peerConnection, peerConnections, config, cleanUpCode, clickedNewRoom, roomWasCreated];
}

export default RoomLogic;