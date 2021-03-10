import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');


const Lobby = () => {
    const [roomsx, setRooms] = useState({
        roomsx: ['hello', 'sir']
    });


useEffect(() => {
    socket.emit('sendRooms');

}, []);

    socket.once('sendRooms', function (rooms) {
            console.log(rooms);

            setRooms({
                roomsx: rooms,
            })
    });

    const onClick = (e) => {
        let roomName = e.target.getAttribute('room');
        console.log(roomName);
        createRoom(roomName)
    }

      const createRoom = (room) => {
        socket.emit('create', room);
        console.log(`This is my room: ${room}`)
      }



  return (
    <section className='Lobby'>
         {roomsx.roomsx.map((roomName) => (
        <div className="image-type">{roomName}
        <NavLink to={{
            pathname: '/room',
            aboutProps:{
                name: roomName
            }
        }}
        onClick={onClick} room={roomName}>
             Join
        </NavLink>
        </div>
      ))}
    </section>
  );
};

export default Lobby;
