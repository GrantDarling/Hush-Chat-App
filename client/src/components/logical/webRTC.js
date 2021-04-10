const WebRTC = () => {
    
    const onWebRTC = (socket, videoElement, peerConnections, config, pc, video) => {

        socket.on("offer", (id, description, pc) => {
            pc.current = new RTCPeerConnection(config);
            pc.current
                .setRemoteDescription(description)
                .then(() => pc.current.createAnswer())
                .then(sdp => pc.current.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, pc.current.localDescription);
                });
            pc.current.ontrack = event => {
                video.current.srcObject = event.streams[0];
            };
            pc.current.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };
        });


        socket.on("answer", (id, description) => {
            peerConnections[id].setRemoteDescription(description)
        });

        socket.on("watcher", id => {
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[id] = peerConnection;

            let stream = videoElement.current.srcObject;
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };

            peerConnection 
                .createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                socket.emit("offer", id, peerConnection.localDescription, pc);
                });

        })

        socket.on("candidate", (id, candidate) => {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });
    }

    const displayUserMedia = (socket, videoElement) => {
        // !!! Make me a useRef!
        const videoSelect = document.querySelector("select#videoSource");

        videoSelect.onchange = getStream;

        async function getDevices() {
            return navigator.mediaDevices.enumerateDevices();
        }

        async function filterDevices(devices) {
            window.deviceInfos = devices;
            for (const device of devices) {
                const option = document.createElement("option");
                option.value = device.deviceId;

                if (device.kind === "videoinput") {
                    option.text = device.label || `Camera ${videoSelect.length + 1}`;
                    videoSelect.appendChild(option);
                }
            }
        }

        async function streamWebCam() {
            try {
                const devices = await getDevices();
                const webCams = await filterDevices(devices);
                await getStream(webCams);
            } 
            catch (error) { console.log(error) };
        }

        async function getStream() {
            if (window.stream) {
                window.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            const videoSource = videoSelect.value;
            const constraints = {
                video: { deviceId: videoSource ? { exact: videoSource } : undefined }
            };

            try {
                let userMedia = await navigator.mediaDevices.getUserMedia(constraints);
                return await gotStream(userMedia);

            } catch (error) { 
                return console.error("Error: ", error);
            }
        }

        async function gotStream(stream) {
            window.stream = stream;
            videoSelect.selectedIndex = [...videoSelect.options].findIndex(
                option => option.text === stream.getVideoTracks()[0].label
            );
            videoElement.current.srcObject = stream;
            socket.emit("broadcaster");
        }
        streamWebCam();
    }
    return [onWebRTC, displayUserMedia];
}

export default WebRTC;
