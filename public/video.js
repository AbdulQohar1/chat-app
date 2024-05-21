
let appId = 'b99185c9638e4a36b7dba86b2900ba9c';
let token = null;
let userId = String(Math.floor(Math.random() * 30000));

let client;
let channel;

let localStream;
let remoteStream;
let peerConnection;


const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    }
  ]
};


let init = async () => {
  try {
    // Create the RTM client instance
    console.log('AgoraRTM:', AgoraRTM);
    client = AgoraRTM.createInstance(appId);

    console.log('RTM client instance created successfully');
    // Proceed with your Agora RTM logic here...

    await client.login({ uid: userId, token });
    console.log('RTM client logged in successfully');

    channel = client.createChannel('main');
    await channel.join();
    console.log('Joined the channel successfully');

    channel.on('MemberJoined', handleUserJoined);

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    document.getElementById('user-1').srcObject = localStream;

    createOffer();
  } catch (error) {
    console.error('Failed to create RTM client instance:', error);
  }
};

let handleUserJoined = async (MemberId) => {
  console.log('New user joined the channel:', MemberId);
};

let createOffer = async () => {
  const servers = null; // You can configure STUN/TURN servers here
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate);
      // Handle sending ICE candidate to remote peer here
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  console.log('Offer:', offer);
  // Send the offer to the remote peer via your signaling server
};

// Initialize the RTM client and set up event listeners when the document is ready
document.addEventListener('DOMContentLoaded', (event) => {
  init();
});


/*
let init = async () => {

  try {
    // Create the RTM client instance
    const client = AgoraRTM.createInstance(APP_ID);
    console.log('RTM client instance created successfully');
    // Proceed with your Agora RTM logic here...
  } catch (error) {
    console.error('Failed to create RTM client instance:', error);
  }

  await client.login({ userId, token});
  // client = await AgoraRTM.createInstance(APP_ID);

  // index.html?room=123445
  channel = client.createChannel('main');
  await channel.join();

  channel.on('MemberJoined' , handleUserJoined);

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });
  document.getElementById('user-1').srcObject = localStream;

  createOffer();
}; 

let handleUserJoined = async (MemberId) => {
console.log('New user joined the channel:' , MemberId);
}

let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach( (track) => {
    peerConnection.addTrack( track, localStream)
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach( (track) => {
      remoteStream.addTrack(track)
    })
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate);
    }
  }


  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  // console.log('Offer:' , offer);
}

// init();
document.addEventListener('DOMContentLoaded', (event) => {
  init();
})
*/