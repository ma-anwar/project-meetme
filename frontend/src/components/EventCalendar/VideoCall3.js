import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GET_TIMESLOTS } from '../../graphql/queries';
import { START_PEER_CXN } from '../../graphql/mutations';
import { useQuery, useMutation } from '@apollo/client';
import Peer from 'peerjs';

export default function VideoCall3() {
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

  let isOwner = state?.ownIt;

  //NEED QUERY TO GET 'SINGLE' timeslot based on id from param
  //   const {
  //     data: dataTS,
  //     error: errorTS,
  //     refetch: refetchTS,
  //   } = useQuery(GET_TIMESLOT, {
  //     variables: { id: eventId, tsId: tsId },
  //   });

  const { data: dataTS } = useQuery(GET_TIMESLOTS, {
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

      call.on('disconnected', () => {
        setInCall(false);
        console.log('call was disconnected');
        currentUserVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;
        peer.disconnect();
      });

      call.on('close', () => {
        setInCall(false);
        console.log('call was ended');
        currentUserVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;
        peer.disconnect();
      });
    });

    peerInstance.current = peer;
  }, [isOwner, userProfile._id]);

  const call = () => {
    let bJoin = false;
    if (dataTS) {
      let tslots = dataTS?.event?.timeslots;
      for (let i = 0; i < tslots.length; i++) {
        if (tslots[i]._id === tsId) {
          setBookerJoined(!(tslots[i].peerId === null));
          bJoin = !(tslots[i].peerId === null);
        }
      }
    }
    if (bJoin) {
      setBeforeCall(false);
      setInCall(true);
      setBeginDisabled(true);
      console.log('SETTING 3, getting REMOTE user media on call with rem ');
      let remPeerId = null;
      console.log('I am owner');
      if (dataTS) {
        console.log('DATAts');
        let tslots = dataTS?.event?.timeslots;
        console.log(dataTS);
        console.log(tslots.length);
        for (let i = 0; i < tslots.length; i++) {
          if (tslots[i]._id === tsId) {
            console.log('TSLOT');
            console.log(tslots[i]);
            remPeerId = tslots[i].peerId;
            console.log('SET REM ID ' + remPeerId);
          }
        }
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
              <video ref={currentUserVideoRef} />
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
