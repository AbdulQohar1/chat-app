
let localStream;
let remoteStream;
let peerConnection;
let didIOffer = false

const user1El = document.getElementById('user-1');
const user2El = document.getElementById('user-2');

const peerConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302', 
        'stun:stun1.l.google.com:19302'
      ]
    }
  ]
};

let init = async () => {
  // Request permission to access camera and microphone of the user and add it to the DOM
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });
  document.getElementById('user-1').srcObject = localStream;

};

// Create an offer object
let createOffer = async () => {
  peerConnection = new RTCPeerConnection(peerConfiguration);

  // Set remote stream for user-2 & add it to the DOM  
  remoteStream = new MediaStream();
  document.getElementById('user-2').srcObject = remoteStream;

  // Add local tracks to peerconnection  
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track , localStream);
  });

  // Listen for the event when the remotepeer add track to the peerConnection
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track, remoteStream);
    });
  };

  // Troubleshoot signaling error 
  peerConnection.addEventListener('signalingstatechange' , (event) => {
    console.log(event);
    console.log(peerConnection.signalingState);
  })

  // add an eventlistner for every time a new ice candidate is created
  peerConnection.onicecandidate = async (event) => {
     if (event.candidate) {
        console.log('New ICE candidate: ', event.candidate);
     }
  };

  // Add eventlistener to listen for neww track to  the peerConnection 

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  console.log('Offer:' , offer);
  // await peerConnection.setRemoteDescription(offer);
}

init();