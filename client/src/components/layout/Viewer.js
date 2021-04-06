import React, { useEffect, createRef } from 'react';


const Viewer = ({socket}) => {
    const video = createRef();
    const peerConnection = createRef();



    useEffect(() => {
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
        peerConnection.close();
        };

        function enableAudio() {
        console.log("Enabling audio")
        video.current.muted = false;
        }

    }, [socket, peerConnection])
  return (
    <div>
        <video ref={video} id="localVideo" playsInline autoPlay muted></video>
    </div>  
);
};

export default Viewer;
