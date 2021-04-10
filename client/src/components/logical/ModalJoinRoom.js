import { useState } from 'react';

const ModalJoinRoom = (room, lobby) => {
    const [redirect, setRedirect] = useState(false);
    const [other, setOther] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        setRedirect(true);
    };

    const onChangeGuest = (e) => setOther(e.target.value);

    return [onSubmit, onChangeGuest, redirect, other];
}

export default ModalJoinRoom;