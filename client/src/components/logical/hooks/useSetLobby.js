import { useEffect, useState } from 'react';

function useSetLobby(socket) {
    const [lobby, setLobby] = useState([]);

    useEffect(() => {
        socket.on('get rooms', (rooms) => setLobby(rooms));
        socket.emit('get rooms'); 
        return () => {
          setLobby({});
        }
    }, [socket]);

  return lobby;
}

export default useSetLobby;