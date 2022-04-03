import { Typography, Box, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OwnerCalendar from './OwnerCalendar';
import BookerCalendar from './BookerCalendar';
import { GET_EVENT, GET_TIMESLOTS } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import fromUnixTime from 'date-fns/fromUnixTime';

export default function EventCalendar() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

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

  const { userProfile } = useAuth();
  let isOwner = data?.event?.ownerId?._id === userProfile._id;

  const [allAvailableAppts, setAvailableAppts] = useState([]);
  const [showError, setShowError] = useState(false);

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

      if (isOwner) {
        setAvailableAppts(formattedDates || []);
        console.log('LOOK HERE');
        console.log(formattedDates);
      } else {
        const newFormattedDates = [];
        for (let i = 0; i < formattedDates.length; i++) {
          if (
            !formattedDates[i].bookerId ||
            formattedDates[i].bookerId._id === userProfile._id
          ) {
            newFormattedDates.push(formattedDates[i]);
          }
        }
        setAvailableAppts(newFormattedDates || []);
      }
    }
    //UNCOMMENT this to be when errorTS is returned
    // else {
    //   setShowError(true);
    //   setTimeout(() => {
    //     navigate('/profile/');
    //   }, 8000);
    // }
    const interval = setInterval(() => {
      refetchTS();
      console.log('bruh im refetching!!!');
    }, 3000);
    return () => clearInterval(interval);
  }, [error, data, isOwner, userProfile._id, errorTS, dataTS, refetchTS]);

  const eventUrl = window.location.href;

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" m={1}>
        <Typography variant="h4">{data?.event.title}</Typography>
        {isOwner && !showError ? (
          <Typography>
            Share Link: <Link href={eventUrl}>{eventUrl}</Link>
          </Typography>
        ) : (
          <Typography>{data?.event.description}</Typography>
        )}
      </Box>
      {isOwner && !showError ? (
        <OwnerCalendar
          slots={allAvailableAppts}
          setSlots={setAvailableAppts}
          eventId={eventId}
          timeslotLength={data?.event?.timeslotLength}
          isOwner={isOwner}
        />
      ) : null}
      {!isOwner && !showError ? (
        <BookerCalendar
          slots={allAvailableAppts}
          setSlots={setAvailableAppts}
          eventId={eventId}
          timeslotLength={data?.event?.timeslotLength}
          isOwner={isOwner}
        />
      ) : null}
      {showError ? (
        <Typography align="center" style={{ color: 'red' }}>
          This calendar does not exist. Redirecting...
        </Typography>
      ) : null}
    </React.Fragment>
  );
}
