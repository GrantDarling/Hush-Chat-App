const WebRTC = () => {
    
    const onWebRTC = (socket, videoElement, peerConnections, config, pc, video) => {
        // Set up hook for 'useOnSocketEmit' 
        socket.on("answer", (id, description) => {
                        console.log(peerConnections)
            peerConnections[id].setRemoteDescription(description)
        });
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
            // async function makeCall() {
            //     const offer = await peerConnection.createOffer();
            //     await peerConnection.setLocalDescription(offer);
            //     await socket.emit("offer", id, peerConnection.localDescription);
            // }
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

        // socket.on("disconnectPeer", id => {
        //     peerConnections[id].close();
        //     delete peerConnections[id];
        // });

        // window.onunload = window.onbeforeunload = () => {
        // socket.close();
        // };

                console.log('launched!');
        socket.on("offer", (id, description, pc) => {
            
            pc.current = new RTCPeerConnection(config);
            console.log(`PC #2 is: ${pc.current}`)
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

        // socket.on("candidate", (id, candidate, pc) => {
        //     pc.current
        //         .addIceCandidate(new RTCIceCandidate(candidate))
        //         .catch(e => console.error(e));
        // });

    }

    const onWebRTC2 = (socket, videoElement2, peerConnections, config) => {
        // // Create my own connection! *****


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

    }

    const displayUserMedia = (socket, videoElement, broadcaster) => {
                // Make me a useRef!
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
            socket.emit(broadcaster);
        }

        streamWebCam();
    }
    return [onWebRTC, onWebRTC2, displayUserMedia];
}

export default WebRTC;
