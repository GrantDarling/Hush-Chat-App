import React, { useEffect, useState, createRef, useRef } from 'react';
import Modal from './Modal';
import CreateRoom from './ModalCreateRoom';
import HostPlaceholder from "../../images/user-placeholder1.png";
import GuestPlaceholder from "../../images/user-placeholder2.png";
import ModalSwitch from '../logical/Modal';
import RoomLogic from '../logical/RoomLogic';

const Room = ({ state, socket }) => {
    const [isOpen, toggleModal] = ModalSwitch();
    const [room, setRoom] = useState({
        name: '',
        host: {
            name: '',
            allowVideo: 'true',
        },        
        guest: {
            name: '',
            allowVideo: 'true'
        },
        chatMessage: '',
        isCreated: false,
        isHost: true,
        hasJoined: false,
        setURL: window.location.href,
    });
    const { isCreated, setURL, isHost, hasJoined, chatMessage } = room;
    const [setLocalRoom, setClientRooms, setJoinedRoom, onChange, sendMessage] = RoomLogic(room, setRoom, socket, chatMessage);

    // WEBRTC CODE !!!!!!!
        const videoElement = useRef();  
        const videoElement2 = useRef();    
        const video = useRef(); 
        const video2 = useRef();  
        const peerConnection = createRef();
        const peerConnection2 = createRef();

    useEffect(() => {
        if(isCreated) {
        const peerConnections = {};
        const config = {
            iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
        };   

        // Answer the call and set remote description
        socket.on("answer", (id, description) => {
            peerConnections[id].setRemoteDescription(description);
            console.log(`Peer connection on answer: ${peerConnections[id]} \n description param: ${description}`)
        });
        console.log('host peerConnections ' + peerConnections)

        // On watcher...
        socket.on("watcher", id => {
        const peerConnection = new RTCPeerConnection(config); // Create new connection
        peerConnections[id] = peerConnection; // Assign specific id in object to peerConnection

        let stream = videoElement.current.srcObject; // Assign stream from video element
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream)); // Assign tracks 

        peerConnection.onicecandidate = event => { // Event listener for ice candidate
            if (event.candidate) {
            socket.emit("candidate", id, event.candidate); // Emit candidate when event fires
            }
        };

            console.log('let\'s connect baby!!')
            // Create offer, set local descrp. then emit offer
            peerConnection 
                .createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                socket.emit("offer", id, peerConnection.localDescription);
                });

        })



        socket.on("candidate", (id, candidate) => {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        // socket.on("disconnectPeer", id => {
        //     peerConnections[id].close();
        //     delete peerConnections[id];
        // });

        // window.onunload = window.onbeforeunload = () => {
        // socket.close();
        // };



        // Get microphone (!!! delete me !)
        const audioSelect = document.querySelector("select#audioSource");
        const videoSelect = document.querySelector("select#videoSource");

        // Get alt streams when changed
        // audioSelect.onchange = getStream;
        videoSelect.onchange = getStream;

        // Fetch streams 
        getStream() // 3.
        .then(getDevices) // 1.
        .then(gotDevices); // 2.

        // 1.
        function getDevices() {
            return navigator.mediaDevices.enumerateDevices();
        }

        // 2. 
        function gotDevices(deviceInfos) {
        window.deviceInfos = deviceInfos;
        for (const deviceInfo of deviceInfos) {
            const option = document.createElement("option");
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === "audioinput") {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
            } else if (deviceInfo.kind === "videoinput") {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
            }
        }
        }

        // 3. 
        function getStream() {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
            track.stop();
            });
        }

        // const audioSource = audioSelect.value;
        const videoSource = videoSelect.value;
        const constraints = {
            // audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then(gotStream)
            .catch(handleError);
        }

        function gotStream(stream) {
            window.stream = stream;
            audioSelect.selectedIndex = [...audioSelect.options].findIndex(
                option => option.text === stream.getAudioTracks()[0].label
            );
            videoSelect.selectedIndex = [...videoSelect.options].findIndex(
                option => option.text === stream.getVideoTracks()[0].label
            );
            videoElement.current.srcObject = stream;
       
            socket.emit("broadcaster");
        }

        function handleError(error) {
            console.error("Error: ", error);
        }
}
    }, [socket, videoElement, isCreated]);
    // WEBRTC CODE !!!!!!!



    // Call WebRTC

    useEffect(() => {

        // Initiate new room
        if (!!state.clickedNewRoom) {
            toggleModal();
            setClientRooms(setRoom, room, socket, peerConnection2, video2);
            state.clickedNewRoom = '';
        }

        // Local room created
        if(isCreated) {
            socket.emit('create room', room.name, room.host.name, room.host.allowVideo);
            socket.emit('join room', room.name);
            setLocalRoom(setRoom, room);
        }

        if(peerConnection) {

        }

        // Guest has joined
        if (!hasJoined && state.hasJoined) {
            setJoinedRoom(setRoom, room, state);
            socket.emit('join room', state.name);
            socket.emit('refresh clients', state.name, state);
            console.log('should now rfresh clients')

        }

        // Clean up & close room
        return function cleanup() {
            let thisURL = window.location.href;
            if (thisURL !== setURL && isHost) {
                state.clickedNewRoom = 'true'
                socket.emit('close room', room.name);
                socket.emit('message', `${room.host.name} left the chat. Room closed...`, room.name, '', `message-general`, true);
                return setRoom({})
            }

            if(thisURL !== setURL) {
                socket.emit('message', `${room.host.name} left the chat.`, room.name, '', `message-general`, true);
                return setRoom({})
            };

        }
    },[socket, room, state, isCreated, isHost, hasJoined, setURL, toggleModal, setLocalRoom, setClientRooms, setJoinedRoom, peerConnection])


    // !!! WEBRTC CODE !!!

    useEffect(() => {
        if(state.hasJoined) {
            socket.emit("watcher");
            console.log('trying to connect...');
        
        const config = {
            iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
        };

        socket.on("offer", (id, description) => {
        peerConnection.current = new RTCPeerConnection(config);
        peerConnection.current
            .setRemoteDescription(description)
            .then(() => peerConnection.current.createAnswer())
            .then(sdp => peerConnection.current.setLocalDescription(sdp))
            .then(() => {
            socket.emit("answer", id, peerConnection.current.localDescription);
            });
        peerConnection.current.ontrack = event => {
            video.current.srcObject = event.streams[0];
        };
        peerConnection.current.onicecandidate = event => {
            if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
            }
        };
        });

        socket.on("candidate", (id, candidate) => {
        peerConnection.current
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error(e));
        });

        socket.on("connect", () => {
        socket.emit("watcher");
        });

        socket.on("broadcaster", () => {
        socket.emit("watcher");
        });

        window.onunload = window.onbeforeunload = () => {
        socket.close();
        peerConnection.current.close();
        };

        function enableAudio() {
        console.log("Enabling audio")
        video.current.muted = false;
        }




        // // Create my own connection! *****

        const peerConnections = {};

        // Answer the call and set remote description
        socket.on("answer2", (id, description) => {
            peerConnections[id].setRemoteDescription(description);
            console.log(`Peer connection on answer: ${peerConnections[id]} \n description param: ${description}`)
        });
        console.log('host peerConnections ' + peerConnections)

        // On watcher...
        socket.on("watcher2", id => {
            console.log("watcher started!")
        const peerConnection = new RTCPeerConnection(config); // Create new connection
        peerConnections[id] = peerConnection; // Assign specific id in object to peerConnection

        let stream = videoElement2.current.srcObject; // Assign stream from video element
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream)); // Assign tracks 

        peerConnection.onicecandidate = event => { // Event listener for ice candidate
            if (event.candidate) {
            socket.emit("candidate2", id, event.candidate); // Emit candidate when event fires
            }
        };

            console.log('let\'s connect baby!!')
            // Create offer, set local descrp. then emit offer
            peerConnection 
                .createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                socket.emit("offer2", id, peerConnection.localDescription);
                });

        })



        socket.on("candidate2", (id, candidate) => {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        // // socket.on("disconnectPeer", id => {
        // //     peerConnections[id].close();
        // //     delete peerConnections[id];
        // // });

        // window.onunload = window.onbeforeunload = () => {
        // socket.close();
        // };



        // Get microphone (!!! delete me !)
        const audioSelect = document.querySelector("select#audioSource");
        const videoSelect = document.querySelector("select#videoSource");

        // Get alt streams when changed
        // audioSelect.onchange = getStream;
        videoSelect.onchange = getStream;

        // Fetch streams 
        getStream() // 3.
        .then(getDevices) // 1.
        .then(gotDevices); // 2.

        // 1.
        function getDevices() {
            return navigator.mediaDevices.enumerateDevices();
        }

        // 2. 
        function gotDevices(deviceInfos) {
        window.deviceInfos = deviceInfos;
        for (const deviceInfo of deviceInfos) {
            const option = document.createElement("option");
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === "audioinput") {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
            } else if (deviceInfo.kind === "videoinput") {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
            }
        }
        }

        // 3. 
        function getStream() {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
            track.stop();
            });
        }

        // const audioSource = audioSelect.value;
        const videoSource = videoSelect.value;
        const constraints = {
            // audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
            video: { deviceId: videoSource ? { exact: videoSource } : undefined }
        };
        return navigator.mediaDevices
            .getUserMedia(constraints)
            .then(gotStream)
            .catch(handleError);
        }

        function gotStream(stream) {
            window.stream = stream;
            audioSelect.selectedIndex = [...audioSelect.options].findIndex(
                option => option.text === stream.getAudioTracks()[0].label
            );
            videoSelect.selectedIndex = [...videoSelect.options].findIndex(
                option => option.text === stream.getVideoTracks()[0].label
            );
            videoElement2.current.srcObject = stream;
       
            socket.emit("broadcaster2");
        }

        function handleError(error) {
            console.error("Error: ", error);
        }


        }
    }, [state.hasJoined, video])
    

    // !!! WEBRTC CODE !!!
    
    
    
    return (
        <section className='Room'>
            <h3 className='Room-name'>Chatroom: {room.name}</h3>
                    <section className="select">
        <label htmlFor="audioSource">Audio source: </label>
        <select id="audioSource"></select>
        </section>

        <section className="select">
        <label htmlFor="videoSource">Video source: </label>
        <select id="videoSource"></select>
        </section>

            <div className='chatbox'> 
                <div className='chat'>
                    <div className='messages' id='chat'>
                        <ul className="message-emit">
                            <li>{!!room.name ? `'${room.name}' group created...` : '' }</li>
                            <li>{!!room.host.name ? `${room.host.name} has entered the chat.` : '' }</li>
                            <li>{!!room.guest.name ? `${room.guest.name} has entered the chat.` : '' }</li>
                        </ul>
                    </div>
                    <form className='input-controller' onSubmit={sendMessage}>
                        <input type="text" id='message-input' name='chatMessage' value={chatMessage} onChange={onChange} />
                        <button type='submit'>SEND</button>
                    </form>
                </div>
                <div className='videos'>
                    <div className='host'>
                        <h4 className='username' >{!!room.host.name ? `@${room.host.name}` : '' }</h4>
                        {!!room.host.allowVideo 
                            ? <video ref={videoElement} id="localVideo" playsInline autoPlay muted></video> // &&<video ref={videoElement2} id="localVideo" playsInline autoPlay muted></video>  // <video id="localVideo" autoPlay playsInline controls={false}/> // <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }
                        {!!room.host.allowVideo 
                            ? <video ref={videoElement2} id="localVideo" playsInline autoPlay muted></video>  // <video id="localVideo" autoPlay playsInline controls={false}/> // <img src={HostPlaceholder}  alt="Host Placeholder" className='active-video' /> 
                            : <img src={HostPlaceholder}  alt="Host Placeholder" className='' /> }
                    </div>
                    <div className='guest'>
                        <h4 className='username' >{!!room.guest.name ? `@${room.guest.name}` : 'waiting for guest...'}</h4>
                        {!!room.guest.allowVideo 
                            ?  <video ref={video} id="guestVideo" autoPlay playsInline controls={false}/>// <video  id="guestVideo" autoPlay playsInline controls={false}/> // <img src={GuestPlaceholder} alt="Guest Placeholder" className='active-video' />
                            : <img src={GuestPlaceholder} alt="Guest Placeholder" className='' /> }
                            {!!room.guest.allowVideo 
                            ?  <video ref={video2} id="guestVideo" autoPlay playsInline controls={false}/>// <video  id="guestVideo" autoPlay playsInline controls={false}/> // <img src={GuestPlaceholder} alt="Guest Placeholder" className='active-video' />
                            : <img src={GuestPlaceholder} alt="Guest Placeholder" className='' /> }
                    </div>
                    
                    {/* <video className='host' />
                    <video className='guest' /> */}
                </div>

                <Modal isOpen={isOpen} >
                    <CreateRoom socket={socket} onChange={onChange} toggleModal={toggleModal} room={room} setRoom={setRoom} />
                </Modal>

            </div>
        </section>
    );
};

export default Room;
