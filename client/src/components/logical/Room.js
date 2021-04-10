import {useState, useRef, createRef, useCallback } from 'react';
import Socket from './Socket';
import webRTC from './webRTC';
import ModalSwitch from './Modal';

const RoomLogic = (socket, state) => {
    const [isOpen, toggleModal] = ModalSwitch();
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
    const { isCreated, setURL, isHost, chatMessage, hasJoined } = room;
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

    // General Functons 
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

    // Set Room Functions 
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

    const setLocalRoom = useCallback(() => {
        setRoom({ 
            ...room, 
            isCreated: false
        });
    }, [setRoom, room]);

    // UseEffect Functions
    const clickedNewRoom = useCallback(() => {
        if (!!state.clickedNewRoom) {
            toggleModal();
            setClientRooms();

            state.clickedNewRoom = '';
        }    
    }, [toggleModal, state, setClientRooms]);
    
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

    const userHasJoinedFunc = useCallback(() => {
        if (!hasJoined && state.hasJoined) {
            setJoinedRoom(state);
            socket.emit('join room', state.name);
            socket.emit('refresh clients', state.name, state);
        }    

    }, [hasJoined, setJoinedRoom, socket, state]);


    const otherFunc = useCallback(() => {
        if(state.hasJoined) {
            socket.emit("watcher");
            console.log('trying to connect...');
            if(switcher) {
                displayUserMedia(socket, videoElement2);
                onWebRTC(videoElement2, peerConnection, video2);
                switcher.current = false;
            }
        }
    },[state.hasJoined, video]);
    
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


    return [onChange, sendMessage, room, setRoom, videoElement, videoElement2, video, video2, cleanUpCode, clickedNewRoom, roomWasCreated, userHasJoinedFunc, otherFunc, isOpen, toggleModal];
}

export default RoomLogic;