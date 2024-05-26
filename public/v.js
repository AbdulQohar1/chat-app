
let appId = 'b99185c9638e4a36b7dba86b2900ba9c';
let token = null;
let userId = String(Math.floor(Math.random() * 30000));

let client;
let channel;

let localStream;
let remoteStream;
let peerConnection;

// let localStream = document.getElementById('local-stream');
// let remoteStream = document.getElementById('remote-stream');

const peerConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.1.google.com:19302', 
        'stun:stun2.1.google.com:19302'
      ]
    }
  ]
};

// client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
client = AgoraRTC.createClient(appId);
console.log(client);

const call = async (event) => {
  await fetchUsermedia();

  // set peerConnection with STUN servers
  await createPeerConnection();

  // create offer time 
  try {
    console.log('Creating offer...');
    const offer = await peerConnection.createOffer();
    console.log(offer);
    peerConnection.setLocalDescription(offer);
    didIOffer = true;
    socket.emit('newOffer' , offer);
  } catch (err) {
    console.log(err);
  }
}

// let init = async () => {
//   try {
//     // Create the RTM client instance
//     // console.log(['AgoraRTC:' , 'AgoraRT:M'], [AgoraRTC, Ago]);
//     // console.log('AgoraRTM:', AgoraRTM);
//     // client = AgoraRTC.createClient(appId);
//     const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

//     console.log('RTM client instance created successfully');
//     // Proceed with your Agora RTM logic here...

//      client.login({ uid: userId, token });
//     console.log('RTM client logged in successfully');

//     channel = client.createChannel('main');
//     await channel.join();
//     console.log('Joined the channel successfully');

//     channel.on('MemberJoined', handleUserJoined);

//     localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: false
//     });
//     document.getElementById('user-1').srcObject = localStream;

//     createOffer();
//   } catch (error) {
//     console.error('Failed to create RTM client instance:', error);
//   }
// };

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

const fetchUsermedia = () => {
  return new Promise( async(resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true
      });

      document.getElementById('user-1').srcObject = stream;
      localStream = stream;
      resolve(); 
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

const createPeerConnection = (offerObj) => {
  return new Promise( async ( resolve, reject) => {
    // Create RTCPeerConnection 
    // Pass config object to the STUN servers which will fetch the ICE candidates
    peerConnection = await new RTCPeerConnection(peerConfiguration);
    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream; //remoteVideo Element

    localStream.getStream.getTracks().forEach( (track) => {
      // Adding localtracks so that they can get forwarded to the localStream
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener('signalingstatechange' , (e) => {
      console.log(e);
      console.log(peerConnection.signalingState);
    });

    peerConnection.addEventListener('icecandidate' , event => {
      console.log('...... Ice candidate found!.......');
      console.log(event);
      if (event.candidate) {
        socket.emit('sendIceCandidateToSignalingServer' , {
          iceCandidate: e.candidate,
          didIOffer,
        });
      };
    });

    peerConnection.addEventListener('track' , event => {
      console.log('Got a track fromm the other peer!');
      console.log(event);

      event.streams[0].getTracks().forEach( (track) => {
        remoteStream.addTrack( track, remoteStream);
        console.log("Remote track Connection secured");
      });
    });
    
    if (offerObj) {
      await peerConnection.setRemoteDescription(offerObj)
    };

    resolve();
  })
}

// Initialize the RTM client and set up event listeners when the document is ready
document.addEventListener('DOMContentLoaded', (event) => {
  init();
});

