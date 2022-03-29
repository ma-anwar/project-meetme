import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GET_TIMESLOTS } from '../../graphql/queries';
import { START_PEER_CXN } from '../../graphql/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Peer from 'peerjs';

export default function VideoCall3() {
  const { eventId, tsId } = useParams();

  const [peerId, setPeerId] = useState(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  //SEPERATE based on owner vs booker
  const { userProfile } = useAuth();

  //NEED QUERY TO GET timeslot based on id from param
  //timeslot should provide eventId so i can query for it

  //given eventId, need to query for event info
  //let isOwner = event?.ownerId?._id === userProfile._id;
  let isOwner = userProfile.username === 'test1';
  //let isOwner = true;

  //   const {
  //     data: dataTS,
  //     error: errorTS,
  //     refetch: refetchTS,
  //   } = useQuery(GET_TIMESLOT, {
  //     variables: { id: eventId, tsId: tsId },
  //   });

  const {
    data: dataTS,
    error: errorTS,
    refetch: refetchTS,
  } = useQuery(GET_TIMESLOTS, {
    variables: { id: eventId },
  });

  const [addPeerId] = useMutation(START_PEER_CXN, {
    refetchQueries: [GET_TIMESLOTS],
  });

  useEffect(() => {
    const peer = new Peer({
      host: 'meetme-peers.herokuapp.com',
      port: 80,
      debug: 4,
    });

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('SETTING 1, setting peer id on open with id ' + id);
      if (!isOwner) {
        const peerCxn = {
          eventId: eventId,
          slotId: tsId,
          peerId: id,
        };

        addPeerId({
          variables: { input: peerCxn },
        });
      }
    });

    peer.on('call', (call) => {
      console.log('SETTING 2, getting user media on call');
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        console.log('MAN emitted when remote tries to call u!');
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
    console.log(
      'SETTING 3, getting REMOTE user media on call with rem ' + remotePeerId
    );
    let remPeerId = remotePeerId;
    console.log('I am owner');
    if (dataTS) {
      console.log('HELLO DATATts');
      let tslots = dataTS?.event?.timeslots;
      console.log(dataTS);
      console.log(tslots.length);
      for (let i = 0; i < tslots.length; i++) {
        if (tslots[i]._id === tsId) {
          console.log('IT ME');
          console.log(tslots[i]);
          remPeerId = tslots[i].peerId;
          console.log('SET REM ID ' + remPeerId);
        }
      }
    }
    console.log('did datats say hello?');
    console.log(dataTS);
    console.log('maybe err');
    console.log(errorTS);

    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      console.log('BRUH I am calling remote id ' + remPeerId);

      const call = peerInstance.current.call(remPeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        console.log('remote streeam');
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
        {isOwner ? (
          <h1>Current user id is {remotePeerIdValue}</h1>
        ) : (
          <h1>Current user id is {peerId}</h1>
        )}
        <input
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        />
        {isOwner ? (
          <Button onClick={() => call(remotePeerIdValue)}>Call</Button>
        ) : null}
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Box m={1}>
            <Typography>Your video</Typography>
            <video ref={currentUserVideoRef} />
          </Box>
          <Box m={1}>
            <Typography>Other Participant Video</Typography>
            <video ref={remoteVideoRef} />
          </Box>
        </Box>
      </div>
    </React.Fragment>
  );
}
