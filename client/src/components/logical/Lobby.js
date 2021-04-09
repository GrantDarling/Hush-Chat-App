import { useState } from 'react';
import ModalSwitch from './Modal';
import useSetLobby from './hooks/useSetLobby';

const Lobby = (socket) => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [room, setRoom] = useState({});
    const lobby = useSetLobby(socket);

    const onClick = (chosenRoom) => {
        setRoom(chosenRoom);
        toggleModal();
    }

    return [onClick, lobby, room, isOpen, toggleModal];
}

export default Lobby;