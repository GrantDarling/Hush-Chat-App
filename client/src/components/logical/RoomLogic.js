import Socket from '../logical/Socket';
import webRTC from '../logical/webRTC';
// import useSound from 'use-sound';
// import boop from '../../sounds/boop.mp3';

const RoomLogic = (room, setRoom, socket, chatMessage) => {
    const [postMessage] = Socket();
//     const [emitBoop] = useSound(
//     boop,
//     { volume: 0.25 }
//   );

    const setLocalRoom = (setRoom, room) => {
        setRoom({ 
            ...room, 
            isCreated: false
        });
    };

    const setClientRooms = (setRoom, room, socket, peerConnection2, video2) => {
        socket.on('refresh clients', (state) => {
            socket.emit("watcher2");
            console.log('trying to connect...');
        
        const config = {
            iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
        };

        socket.on("offer2", (id, description) => {
        peerConnection2.current = new RTCPeerConnection(config);
        peerConnection2.current
            .setRemoteDescription(description)
            .then(() => peerConnection2.current.createAnswer())
            .then(sdp => peerConnection2.current.setLocalDescription(sdp))
            .then(() => {
            socket.emit("answer2", id, peerConnection2.current.localDescription);
            });
        peerConnection2.current.ontrack = event => {
            video2.current.srcObject = event.streams[0];
        };
        peerConnection2.current.onicecandidate = event => {
            if (event.candidate) {
            socket.emit("candidate2", id, event.candidate);
            }
        };
        });

        socket.on("candidate2", (id, candidate) => {
        peerConnection2.current
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error(e));
        });

        socket.on("connect", () => {
        socket.emit("watcher2");
        });

        socket.on("broadcaster2", () => {
        socket.emit("watcher2");
        });

        window.onunload = window.onbeforeunload = () => {
        socket.close();
        peerConnection2.current.close();
        };

        function enableAudio() {
        console.log("Enabling audio")
        video2.current.muted = false;
        }



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

    const setJoinedRoom = (setRoom, room, state) => {
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
    return [setLocalRoom, setClientRooms, setJoinedRoom, onChange, sendMessage, webRTC];
}

export default RoomLogic;