import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GET_TIMESLOT } from '../../graphql/queries';
import { START_PEER_CXN } from '../../graphql/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Peer from 'peerjs';

export default function VideoCall() {
  const { eventId, tsId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [beforeCall, setBeforeCall] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [beginDisabled, setBeginDisabled] = useState(false);
  const [bookerJoined, setBookerJoined] = useState(false);

  const { userProfile } = useAuth();

  const callEnded = 'Call Ended';

  let isOwner = state?.ownIt;

  const { data: dataSingle, refetch: refetchSingle } = useQuery(GET_TIMESLOT, {
    variables: { input: { eventId, slotId: tsId } },
  });

  const [addPeerId] = useMutation(START_PEER_CXN);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchSingle();
    }, 3000);
    return () => {
      clearInterval(interval);
      const peerCxn = {
        eventId: eventId,
        slotId: tsId,
        peerId: callEnded,
      };

      addPeerId({
        variables: { input: peerCxn },
      });
    };
  }, [refetchSingle]);

  console.log('THE SINGLE DATA');
  console.log(dataSingle);

  useEffect(() => {
    console.log('IN USE EFFECT SINGLE DATA');
    console.log(dataSingle);
    console.log(dataSingle?.getSlot.peerId);
    console.log('SHOULDA');
    console.log(dataSingle);
    if (dataSingle && dataSingle.getSlot.peerId === callEnded) {
      setInCall(false);
      if (currentUserVideoRef.current)
        currentUserVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      if (peerInstance.current) peerInstance.current.disconnect();
      console.log('ENDED too');
    }
  }, [dataSingle]);

  useEffect(() => {
    const peer = new Peer({
      host: 'meetme-peers.herokuapp.com',
      port: 80,
      debug: 4,
      //REMOVE DEBUG FOR PRODUCTION
    });

    peer.on('open', (id) => {
      console.log('SETTING 1, setting peer id on open with id ' + id);
      if (isOwner === false) {
        console.log(' I am NOT the owner, so add id to ts' + isOwner);
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
      setInCall(true);
      setBeforeCall(false);
      console.log('SETTING 2, getting user media on call');
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        console.log('emitted when remote tries to call u!');
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
  }, [isOwner, userProfile._id]);

  const call = () => {
    let bJoin = false;
    if (dataSingle) {
      setBookerJoined(!(dataSingle.getSlot.peerId === null));
      bJoin = !(dataSingle.getSlot.peerId === null);
    }
    if (bJoin) {
      setBeforeCall(false);
      setInCall(true);
      setBeginDisabled(true);
      console.log('SETTING 3, getting REMOTE user media on call with rem ');
      let remPeerId = null;
      console.log('I am owner');
      if (dataSingle) {
        remPeerId = dataSingle.getSlot.peerId;
        console.log('SET REM ID ' + remPeerId);
      }

      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        console.log('I am calling remote id ' + remPeerId);

        const call = peerInstance.current.call(remPeerId, mediaStream);

        call.on('stream', (remoteStream) => {
          console.log('remote streeam');
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });

        call.on('close', () => {
          console.log('CLOSE IT');
        });
      });
    } else {
      console.log('SORRY, please wait for participant');
    }
  };

  const endCall = () => {
    const peerCxn = {
      eventId: eventId,
      slotId: tsId,
      peerId: callEnded,
    };

    addPeerId({
      variables: { input: peerCxn },
    });

    setInCall(false);
    currentUserVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    peerInstance.current.disconnect();
    console.log('ENDED');
  };

  return (
    <React.Fragment>
      {beforeCall && isOwner ? (
        <Box display="flex" flexDirection="row" justifyContent="center" m={2}>
          <Button
            variant="outlined"
            disabled={beginDisabled}
            onClick={() => call()}
          >
            Begin Call
          </Button>
        </Box>
      ) : null}
      {beforeCall && isOwner && !bookerJoined ? (
        <Box display="flex" alignItems="center" justifyContent="center" m={2}>
          <Typography>
            Please wait for participant to join the meeting.
          </Typography>
        </Box>
      ) : null}
      {beforeCall && !isOwner ? (
        <Box display="flex" alignItems="center" justifyContent="center" m={2}>
          <Typography>Please wait for host to start this meeting.</Typography>
        </Box>
      ) : null}
      {inCall ? (
        <Box>
          <Box display="flex" flexDirection="row" justifyContent="center" m={1}>
            <Button variant="outlined" onClick={() => endCall()}>
              End Call
            </Button>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box m={1}>
              <Typography>Your video</Typography>
              <video ref={currentUserVideoRef} muted="muted" />
            </Box>
            <Box m={1}>
              <Typography>Other Participant Video</Typography>
              <video ref={remoteVideoRef} />
            </Box>
          </Box>
        </Box>
      ) : null}
      {!beforeCall && !inCall ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          m={1}
        >
          <Typography style={{ color: 'red' }}>The call was ended</Typography>

          <Typography>Click here to go back to your profile </Typography>
          <Button variant="contained" onClick={() => navigate('/profile')}>
            Profile
          </Button>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
