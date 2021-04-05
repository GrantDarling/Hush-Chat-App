const webRTC = (targetElement, peerConnection) => {
    const openMediaDevices = async (constraints) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    }

    try {
      const stream = openMediaDevices({ video: true, audio: true });
      console.log('Got MediaStream:', stream);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }

    async function playVideoFromCamera() {
      try {
        const constraints = { video: true, audio: false }; // Make audio true
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // peerConnection.addTrack(constraints, stream);
       
        if(document.querySelector(targetElement)) {
          const videoElement = document.querySelector(targetElement);
          videoElement.srcObject = stream;
          videoElement.srcObject.getTracks().forEach(track => peerConnection.addTrack(track, stream));
          
          peerConnection.ontrack = event => {
            videoElement.srcObject = event.streams[0];
        };

        }
      } catch (error) {
        console.error('Error opening video camera.', error);
      }
    }


    return playVideoFromCamera();
}

export default webRTC;