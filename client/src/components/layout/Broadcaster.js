import React, { useEffect, createRef } from 'react';


const Broadcaster = ({socket}) => {
    const videoElement = createRef();

    useEffect(() => {
        const peerConnections = {};
        const config = {
            iceServers: [{ "urls": "stun:stun.l.google.com:19302" }]
        };   

        // Answer the call and set remote description
        socket.on("answer", (id, description) => {
            peerConnections[id].setRemoteDescription(description);
            console.log(`Peer connection on answer: ${peerConnections[id]} \n description param: ${description}`)
        });

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

        // Create offer, set local descrp. then emit offer
        peerConnection 
            .createOffer()
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(() => {
            socket.emit("offer", id, peerConnection.localDescription);
            });
        });

        socket.on("candidate", (id, candidate) => {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("disconnectPeer", id => {
            peerConnections[id].close();
            delete peerConnections[id];
        });

        window.onunload = window.onbeforeunload = () => {
        socket.close();
        };



        // Get microphone (!!! delete me !)
        const audioSelect = document.querySelector("select#audioSource");
        const videoSelect = document.querySelector("select#videoSource");

        // Get alt streams when changed
        audioSelect.onchange = getStream;
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

        const audioSource = audioSelect.value;
        const videoSource = videoSelect.value;
        const constraints = {
            audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
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

    }, [socket, videoElement]);
  return (
    <div>
        <section className="select">
        <label htmlFor="audioSource">Audio source: </label>
        <select id="audioSource"></select>
        </section>

        <section className="select">
        <label htmlFor="videoSource">Video source: </label>
        <select id="videoSource"></select>
        </section>

        <video ref={videoElement} playsInline autoPlay muted></video>
    </div>
  );
};

export default Broadcaster;