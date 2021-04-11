import {useState } from 'react';
import Socket from './Socket';
import ModalSwitch from './Modal';

// Import useEffect Hooks
import useSetNewRoom from './hooks/useSetNewRoom';
import useCreateRoom from './hooks/useCreateRoom';
import useJoinRoom from './hooks/useJoinRoom';
import useCodeCleanup from './hooks/useCodeCleanup';

const RoomLogic = (socket, state) => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [postMessage] = Socket(socket, room, setRoom);
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
    useSetNewRoom(socket, state, toggleModal, setRoom, room);
    useCreateRoom(socket, room, setRoom, isCreated);
    useJoinRoom(socket, state, room, setRoom);
    useCodeCleanup(socket, state, room, setRoom);

    return [onChange, sendMessage, room, setRoom, isOpen, toggleModal];
}

export default RoomLogic;