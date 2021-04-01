
const RoomLogic = (room, setRoom) => {

    const setLocalRoom = (setRoom, room) => {
        setRoom({ 
            ...room, 
            host: {
                name: room.host.name,
                allowVideo: room.host.AllowVideo,
            },
            isCreated: false
        });
    };

    const setClientRooms = (setRoom, room, socket) => {
        socket.on('refesh clients', (state) => {
            setRoom({ 
                ...room, 
                name: state.joinRoomName,
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
            ? setRoom({ ...room, [e.target.name]: { name: e.target.value }})
            : setRoom({ ...room, [e.target.name]: e.target.value })
        )
    }
    return [setLocalRoom, setClientRooms, setJoinedRoom, onChange];
}

export default RoomLogic;