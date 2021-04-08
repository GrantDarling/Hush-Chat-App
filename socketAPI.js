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
        
            socket.on('refresh clients', (emittedRoom, guestState) => {
            return socket.to(emittedRoom).emit('refresh clients', guestState)
            });

            socket.on('message', (message, emittedRoom, sender, messageClass, audio) => {
                socket.to(emittedRoom).emit('message', sender, message, messageClass, audio);
            });

            socket.on('get rooms', () => {
                socket.emit('get rooms', rooms)
            });

            socket.on('close room', (emittedRoom) => {
                const roomsOmitEmitted = rooms.filter((room) => room.name !== emittedRoom);
                socket.to(emittedRoom).emit('host left', clientID);
                rooms = roomsOmitEmitted
            });

            // WebRTC Sockets (revise)
            socket.on('joinedz', () => {
                socket.emit("joinedz");
            });

            socket.on("broadcaster", () => {
                broadcaster = socket.id;
                socket.broadcast.emit("broadcaster");
            });
            socket.on("watcher", () => {
                socket.to(broadcaster).emit("watcher", socket.id);
            });
            socket.on("offer", (id, message) => {
                socket.to(id).emit("offer", socket.id, message);
            });
            socket.on("answer", (id, message) => {
                socket.to(id).emit("answer", socket.id, message);
            });
            socket.on("candidate", (id, message) => {
                socket.to(id).emit("candidate", socket.id, message);
            });
            socket.on("disconnect", () => {
                socket.to(broadcaster).emit("disconnectPeer", socket.id);
            });


            // Duplicates
                socket.on("broadcaster2", () => {
                broadcaster = socket.id;
                socket.broadcast.emit("broadcaster2");
            });
            socket.on("watcher2", () => {
                socket.to(broadcaster).emit("watcher2", socket.id);
            });
            socket.on("offer2", (id, message) => {
                socket.to(id).emit("offer2", socket.id, message);
            });
            socket.on("answer2", (id, message) => {
                socket.to(id).emit("answer2", socket.id, message);
            });
            socket.on("candidate2", (id, message) => {
                socket.to(id).emit("candidate2", socket.id, message);
            });
            socket.on("disconnect2", () => {
                socket.to(broadcaster).emit("disconnectPeer2", socket.id);
            });


        });
    },


    closeRoom: (socket, emittedRoom) => {
        const roomsOmitEmitted = rooms.filter((room) => room.name !== emittedRoom);
        socket.to(emittedRoom).emit('host left', socket.client.id);
        rooms = roomsOmitEmitted
    },

    disconnect: (socket) => {
            // return console.log(`${socket.client.id} disconnected...`);
    },

};