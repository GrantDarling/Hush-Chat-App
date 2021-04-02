const webRTC = () => {
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
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
      } catch (error) {
        console.error('Error opening video camera.', error);
      }
    }

    return playVideoFromCamera();;
}

export default webRTC;