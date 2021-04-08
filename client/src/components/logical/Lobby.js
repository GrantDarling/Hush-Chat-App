import { useState } from 'react';
import ModalSwitch from '../logical/Modal';

const LobbyLogic = () => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [lobby, setLobby] = useState([]);
    const [room, setRoom] = useState({});

    const onClick = (chosenRoom) => {
        setRoom(chosenRoom);
        toggleModal();
    }

    const getRooms = (socket) => {
        socket.on('get rooms', (rooms) => setLobby(rooms));
        socket.emit('get rooms');
    }    

    return [onClick, getRooms, lobby, setLobby, room, isOpen, toggleModal];
}

export default LobbyLogic;