/* PeerJs - (https://peerjs.com/) & (https://github.com/manojsinghnegiwd/peerjs-example/tree/master/src) */

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
  let medStream = useRef(null);
  const [beforeCall, setBeforeCall] = useState(true);
  const [inCall, setInCall] = useState(false);

  const { userProfile } = useAuth();

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
        peerId: null,
        peerCallEnded: true,
      };

      addPeerId({
        variables: { input: peerCxn },
      });
    };
  }, [refetchSingle, addPeerId, eventId, tsId]);

  useEffect(() => {
    if (dataSingle && dataSingle.getSlot.peerCallEnded) {
      setInCall(false);

      if (medStream.current) medStream.current.getVideoTracks()[0].stop();
      if (medStream.current) medStream.current.getAudioTracks()[0].stop();
      if (currentUserVideoRef.current)
        currentUserVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      if (peerInstance.current) peerInstance.current.disconnect();
      peerInstance.current = null;

      const peerCxn = {
        eventId: eventId,
        slotId: tsId,
        peerId: null,
        peerCallEnded: true,
      };

      addPeerId({
        variables: { input: peerCxn },
      });

      if (!beforeCall) {
        setTimeout(() => {
          navigate(`/cal/${eventId}`);
        }, 1000);
      }
    }
  }, [
    dataSingle,
    peerInstance,
    peerInstance.current,
    peerInstance?.current?._id,
  ]);

  useEffect(() => {
    const peer = new Peer({
      host: 'manwar.dev',
      port: 443,
      path: '/peerjs/meetme',
    });

    peer.on('open', (id) => {
      if (isOwner === false) {
        const peerCxn = {
          eventId: eventId,
          slotId: tsId,
          peerId: id,
          peerCallEnded: false,
        };

        addPeerId({
          variables: { input: peerCxn },
        });
      }
    });

    peer.on('call', (call) => {
      setInCall(true);
      setBeforeCall(false);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (mediaStream) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          medStream.current = mediaStream;

          call.answer(mediaStream);
          call.on('stream', function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            const p1 = remoteVideoRef.current.play();
            p1.catch((err) => {});
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    });

    peerInstance.current = peer;
  }, [isOwner, userProfile._id, eventId, tsId]);

  const call = () => {
    let bJoin = false;
    if (dataSingle) {
      bJoin = !(dataSingle.getSlot.peerId === null);
    }
    if (bJoin) {
      setBeforeCall(false);
      setInCall(true);
      let remPeerId = null;
      if (dataSingle) {
        remPeerId = dataSingle.getSlot.peerId;
      }

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (mediaStream) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          medStream.current = mediaStream;

          const call = peerInstance.current.call(remPeerId, mediaStream);

          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            const p1 = remoteVideoRef.current.play();
            p1.catch((err) => {});
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    }
  };

  const endCall = () => {
    setInCall(false);

    const peerCxn = {
      eventId: eventId,
      slotId: tsId,
      peerId: null,
      peerCallEnded: true,
    };

    addPeerId({
      variables: { input: peerCxn },
    });

    medStream.current.getVideoTracks()[0].stop();
    medStream.current.getAudioTracks()[0].stop();
    currentUserVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
    if (peerInstance.current) peerInstance.current.disconnect();
    peerInstance.current = null;

    setTimeout(() => {
      navigate(`/cal/${eventId}`);
    }, 1000);
  };

  return (
    <React.Fragment>
      {beforeCall && isOwner ? (
        <Box display="flex" flexDirection="row" justifyContent="center" m={2}>
          <Button variant="outlined" disabled={inCall} onClick={() => call()}>
            Begin Call
          </Button>
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
          <Typography style={{ color: 'red' }}>
            The call was ended. Redirecting...
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
