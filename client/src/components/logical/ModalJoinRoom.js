import { useState } from 'react';

const ModalJoinRoom = (room, lobby) => {
    const [redirect, setRedirect] = useState(false);
    const [other, setOther] = useState('');
    const [allowOtherVideo, setAllowOtherVideo] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        setRedirect(true);
    };

    const onChangeGuest = (e) => setOther(e.target.value);
    const onChangeVideo = (e) => setAllowOtherVideo(e.target.value)

    return [onSubmit, onChangeGuest, onChangeVideo, redirect, other, allowOtherVideo];
}

export default ModalJoinRoom;