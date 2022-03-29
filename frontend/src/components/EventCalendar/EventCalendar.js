import { Typography, Box, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OwnerCalendar from './OwnerCalendar';
import BookerCalendar from './BookerCalendar';
import { GET_EVENT, GET_TIMESLOTS } from '../../graphql/queries';
import { START_PEER_CXN } from '../../graphql/mutations';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import fromUnixTime from 'date-fns/fromUnixTime';
import { differenceInMinutes } from 'date-fns';
import Peer from 'peerjs';

export default function EventCalendar() {
  const { id: eventId } = useParams();

  const { data, error } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  const {
    data: dataTS,
    error: errorTS,
    refetch: refetchTS,
  } = useQuery(GET_TIMESLOTS, {
    variables: { id: eventId },
  });

  const [addPeerId] = useMutation(START_PEER_CXN, {
    refetchQueries: [GET_EVENT],
  });

  const { userProfile } = useAuth();
  let isOwner = data?.event?.ownerId?._id === userProfile._id;

  const [allAvailableAppts, setAvailableAppts] = useState([]);
  //const [peerId, setPeerId] = useState('');

  useEffect(() => {
    if (dataTS) {
      const formattedDates = dataTS?.event?.timeslots.map((slot) => ({
        start: fromUnixTime(slot.start),
        end: fromUnixTime(slot.end),
        title: slot.title,
        _id: slot._id,
        bookerId: slot.bookerId,
        peerId: slot.peerId,
      }));
      console.log('IS TS WORKNING?');
      console.log(formattedDates.length);

      if (isOwner) {
        setAvailableAppts(formattedDates || []);
      } else {
        const newFormattedDates = [];
        let counter = 0;
        for (let i = 0; i < formattedDates.length; i++) {
          if (
            !formattedDates[i].bookerId ||
            formattedDates[i].bookerId._id === userProfile._id
          ) {
            //newFormattedDates.push(formattedDates[i]);
            //let cur = formattedDates[i];
            //console.log('meow');
            //console.log(cur);
            // console.log(new Date());
            // console.log(differenceInMinutes(new Date(), cur.start));

            // if (
            //   differenceInMinutes(new Date(), cur.start) > 0 &&
            //   differenceInMinutes(new Date(), cur.start) < 300 &&
            //   cur.peerId === null
            // ) {
            //   counter++;
            //   // console.log(
            //   //   'CUZ ' + cur.start + ' and ' + cur.end + ' but ' + new Date()
            //   // );
            //   // console.log(differenceInMinutes(new Date(), cur.start));
            //   let peerId = '';
            //   const peer = new Peer({
            //     host: 'meetme-peers.herokuapp.com',
            //     port: 80,
            //     //debug: 4,
            //   });

            // peer.on('open', (id) => {
            //   //setPeerId(id);
            //   peerId = id;
            //   const editedTS = {
            //     start: cur.start,
            //     end: cur.end,
            //     title: cur.title,
            //     _id: cur._id,
            //     bookerId: cur.bookerId,
            //     peerId: peerId,
            //   };

            //   const peerCxn = {
            //     eventId: eventId,
            //     slotId: cur._id,
            //     peerId: peerId,
            //   };

            //   addPeerId({
            //     variables: { input: peerCxn },
            //   });

            //   console.log(editedTS);
            //   newFormattedDates.push(editedTS);
            // });
            // console.log('COUTNERRR ' + counter);

            // } else {
            //   newFormattedDates.push(formattedDates[i]);
            // }

            newFormattedDates.push(formattedDates[i]);
          }
        }
        setAvailableAppts(newFormattedDates || []);
      }
    }
    const interval = setInterval(() => {
      refetchTS();
    }, 3000);
    return () => clearInterval(interval);
  }, [error, data, isOwner, userProfile._id, errorTS, dataTS, refetchTS]);

  const eventUrl = window.location.href;

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" m={1}>
        <Typography variant="h4">{data?.event.title}</Typography>
        {isOwner ? (
          <Typography>
            Share Link: <Link href={eventUrl}>{eventUrl}</Link>
          </Typography>
        ) : (
          <Typography>{data?.event.description}</Typography>
        )}
      </Box>
      {isOwner ? (
        <OwnerCalendar
          slots={allAvailableAppts}
          setSlots={setAvailableAppts}
          eventId={eventId}
          timeslotLength={data?.event?.timeslotLength}
        />
      ) : (
        <BookerCalendar
          slots={allAvailableAppts}
          setSlots={setAvailableAppts}
          eventId={eventId}
          timeslotLength={data?.event?.timeslotLength}
        />
      )}
    </React.Fragment>
  );
}
