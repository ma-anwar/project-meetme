import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Peer from 'peerjs';

export default function VideoCall2() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    //THIS ONE
    // const peer = new Peer({
    //   host: 'localhost',
    //   port: 9000,
    //   path: '/meetme',
    // });

    const peer = new Peer({
      host: 'meetme-peers.herokuapp.com',
      port: 80,
      debug: 4,
    });
    console.log('PEER IS');
    console.log(peer);
    console.log(peer._id);

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('SETTING 1, setting peer id on open');
      console.log(id);
      console.log(peerId);
    });

    peer.on('call', (call) => {
      console.log('SETTING 2, getting user media on call');
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on('stream', function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    console.log('SETTING 3, getting REMOTE user media on call');
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        console.log('remote streeeeam');
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <React.Fragment>
      <Typography>Hello</Typography>
      <div>
        <h1>Current user id is {peerId}</h1>
        <input
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        />
        <button onClick={() => call(remotePeerIdValue)}>Call</button>
        <div>
          <video ref={currentUserVideoRef} />
        </div>
        <div>
          <video ref={remoteVideoRef} />
        </div>
      </div>
    </React.Fragment>
  );
}
