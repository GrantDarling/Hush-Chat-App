import {useState, useRef, createRef } from 'react';
import Socket from './Socket';
import webRTC from './webRTC';
import ModalSwitch from './Modal';

// Import useEffect Hooks
import useSetNewRoom from './hooks/useSetNewRoom';
import useCreateRoom from './hooks/useCreateRoom';
import useJoinRoom from './hooks/useJoinRoom';
import useCodeCleanup from './hooks/useCodeCleanup';

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
        setURL: window.location.href,
    });
    const { isCreated, chatMessage } = room;
    const getUserVideo = useRef(null);  
    const videoElement2 = useRef(null);    
    const video = useRef(); 
    const video2 = useRef();  

    const peerConnections = {};
     const peerConnection = createRef();
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

    // useEffects 
    useSetNewRoom(socket, state, toggleModal, setRoom, room, onWebRTC, getUserVideo, peerConnection, video);
    useCreateRoom(socket, room, setRoom, isCreated, getUserVideo, video, displayUserMedia);
    useJoinRoom(socket, state, room, setRoom, videoElement2, onWebRTC, peerConnection, video2, displayUserMedia);
    useCodeCleanup(socket, state, room, setRoom);


    return [onChange, sendMessage, room, setRoom, getUserVideo, videoElement2, video, video2, useCodeCleanup, isOpen, toggleModal];
}

export default RoomLogic;