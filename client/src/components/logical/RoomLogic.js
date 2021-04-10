import {useState} from 'react';
import Socket from '../logical/Socket';

const RoomLogic = (socket) => {
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
    const { chatMessage } = room;


    const setLocalRoom = () => {
        setRoom({ 
            ...room, 
            isCreated: false
        });
    };

    const setClientRooms = (peerConnection2, video2) => {
        socket.on('refresh clients', (state) => {
            socket.emit("watcher");
            console.log('trying to connect...');


        socket.on("connect", () => {
        socket.emit("watcher");
        });

        socket.on("broadcaster", () => {
        socket.emit("watcher");
        });

        window.onunload = window.onbeforeunload = () => {
        socket.close();
        peerConnection2.current.close();
        };

        // function enableAudio() {
        //     console.log("Enabling audio")
        //     video2.current.muted = false;
        // }



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
    };

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
    return [setLocalRoom, setClientRooms, setJoinedRoom, onChange, sendMessage, room, setRoom];
}

export default RoomLogic;