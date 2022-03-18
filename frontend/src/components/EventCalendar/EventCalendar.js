import { Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OwnerCalendar from './OwnerCalendar';
import { GET_EVENT } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

export default function EventCalendar() {
  //Aliasing as eventId, maybe we should just rename the param to eventId in App
  const { id: eventId } = useParams();
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  const [allAvailableAppts, setAvailableAppts] = useState([]);

  useEffect(() => {
    //Really messy code sorry, need to extract into function
    if (data) {
      console.log(data);
      console.log('got here');
      const formattedDates = data?.event?.timeslots.map((slot) => ({
        start: new Date(slot.start * 1000),
        end: new Date(slot.end * 1000),
        title: slot.title,
      }));
      setAvailableAppts(formattedDates || []);
    }

    console.log(error);
  }, [error, data]);

  const eventUrl = 'Share link';
  //TODO: build out a button component that copys the current url to clipboard for sharing?
  //TODO: Conditonally render OwnerCalendar based on Owner status

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" m={1}>
        <Typography variant="h4">{data?.event.title}</Typography>
        <Typography>{eventUrl}</Typography>
      </Box>

      <OwnerCalendar
        slots={allAvailableAppts}
        setSlots={setAvailableAppts}
        eventId={eventId}
      />
    </React.Fragment>
  );
}
