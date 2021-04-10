// socket.io functions
let rooms = [];
let broadcaster;

module.exports = {

    connectSocket: (io) => {
        io.on("connection", (socket) => {
            const clientID = socket.client.id
            console.log(`${clientID} connected...`)

            // Messenger Sockets
            socket.on('disconnect', () => {
                 return console.log(`${clientID} disconnected...`);
            });

            socket.on('create room', (emittedRoom, emittedHost, emittedAllowHostVideo ) => {
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
            });

            socket.on('join room', emittedRoom => {
                socket.join(emittedRoom);

                rooms.forEach((room) => {
                    if(room.name === emittedRoom && !room.users.includes(clientID)) { 
                        room.users.push(clientID); 
                    };        
                });
            });
        
            socket.on('leave all rooms', () => {
                for (room of rooms) { 
                    if(room.users.includes(clientID)) { 
                        room.users.pop(); // Pops the last element (always guest)
                    };
                    socket.leave(room);
                }
            });
        
            socket.on('broadcast room state', (emittedRoom, guestState) => {
            return socket.to(emittedRoom).emit('broadcast room state', guestState)
            });

            socket.on('message', (message, emittedRoom, sender, messageClass, audio) => {
                socket.to(emittedRoom).emit('message', sender, message, messageClass, audio);
            });

            socket.on('get rooms', () => {
                socket.emit('get rooms', rooms)
            });

            socket.on('close room', (emittedRoom) => {
                const roomsOmitEmitted = rooms.filter((room) => room.name !== emittedRoom);
                socket.to(emittedRoom).emit('host left', emittedRoom);
                console.log(roomsOmitEmitted);
                rooms = roomsOmitEmitted
            });

            socket.on('close all rooms by client id', () => {
                const roomsWithClientID = rooms.filter((room) => room.users.includes(clientID));
                roomsWithClientID.forEach(roomWithClientID => {
                    const roomsOmitEmitted = rooms.filter((room) => room.name !== roomWithClientID.name);
                    socket.to(roomWithClientID.name).emit('host left', roomWithClientID.name);
                    console.log(roomsOmitEmitted);
                    rooms = roomsOmitEmitted
                });
            })

            // WebRTC Sockets
            socket.on("broadcaster", () => {
                broadcaster = socket.id;
                socket.broadcast.emit("broadcaster");
            });
            socket.on("watcher", () => {
                socket.to(broadcaster).emit("watcher", socket.id);
            });
            socket.on("offer", (id, message, peerConnection) => {
                socket.to(id).emit("offer", socket.id, message, peerConnection);
            });
            socket.on("answer", (id, message) => {
                socket.to(id).emit("answer", socket.id, message);
            });
            socket.on("candidate", (id, message, peerConnection) => {
                socket.to(id).emit("candidate", socket.id, message, peerConnection);
            });
            socket.on("disconnect", () => {
                socket.to(broadcaster).emit("disconnectPeer", socket.id);
            });
        });
    },

};