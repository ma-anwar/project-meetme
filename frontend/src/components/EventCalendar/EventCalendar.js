import { Typography, Box, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OwnerCalendar from './OwnerCalendar';
import BookerCalendar from './BookerCalendar';
import { GET_EVENT } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function EventCalendar() {
  //Aliasing as eventId, maybe we should just rename the param to eventId in App
  const { id: eventId } = useParams();
  const { data, error } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  const { userProfile } = useAuth();
  let isOwner = data?.event?.ownerId?._id === userProfile._id;

  const [allAvailableAppts, setAvailableAppts] = useState([]);

  useEffect(() => {
    //Really messy code sorry, need to extract into function
    if (data) {
      console.log(data);
      const formattedDates = data?.event?.timeslots.map((slot) => ({
        start: new Date(slot.start * 1000),
        end: new Date(slot.end * 1000),
        title: slot.title,
        _id: slot._id,
        bookerId: slot.bookerId,
      }));

      //Changes visible slots based on ownership
      if (isOwner) {
        setAvailableAppts(formattedDates || []);
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

    console.log(error);
  }, [error, data, isOwner, userProfile._id]);

  const eventUrl = `localhost:3000/cal/${eventId}`;

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
        />
      )}
    </React.Fragment>
  );
}
