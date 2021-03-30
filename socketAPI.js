// socket.io functions
let rooms = [];

module.exports = {
    connected: (socket) => {
        return console.log(`${socket.client.id} connected...`);
    },

    disconnect: (socket) => {
        return console.log(`${socket.client.id} disconnected...`);
    },

    createRoom: (socket, emittedRoom, emittedHost, emittedAllowHostVideo) => {
        let listOfRooms = [];

        rooms.forEach((room)=> listOfRooms.push(room.name));

        if(!listOfRooms.includes(emittedRoom)) {
            let addRoom = {
                name: emittedRoom,
                host: {
                    name: emittedHost,
                    allowVideo: emittedAllowHostVideo
                },
                users: []
            };
            return rooms.push(addRoom);
        } 
        return;    
    },

    joinRoom: (socket, emittedRoom) => {
        socket.join(emittedRoom);
        socket.to(emittedRoom).emit('user joined', socket.client.id);

        rooms.forEach((room) => {
            if(room.name === emittedRoom && !room.users.includes(socket.client.id)) { 
                room.users.push(socket.client.id); 
                console.log('just pushed ' + socket.client.id);
            };        
        });
        return console.log(rooms);
    },

    leaveAllRooms: (socket) => {
        for (room of rooms) { 
            if(room.users.includes(socket.client.id)) { 
                room.users.pop(); 
            };
            socket.leave(room);
        }
    },

    refreshClients: (socket, emittedRoom, guestState) => socket.to(emittedRoom).emit('refesh clients', guestState),

    sendChatMessage: (socket, sender, message, emittedRoom) => socket.to(emittedRoom).emit('chat message', sender, message),

    getRooms: (socket) => socket.emit('get rooms', rooms),

    closeRoom: (socket, emittedRoom) => {
        const roomsOmitEmitted = rooms.filter((room) => room.name !== emittedRoom);
        socket.to(emittedRoom).emit('host left', socket.client.id);
        rooms = roomsOmitEmitted
    }

};