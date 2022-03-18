import { Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OwnerCalendar from './OwnerCalendar';
import { GET_EVENT } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

const appointments = [
  {
    title: 'Big Meeting',
    allDay: true,
    start: new Date(2022, 2, 17),
    end: new Date(2022, 2, 17),
  },
  {
    title: 'Vacation',
    start: new Date(2021, 6, 7),
    end: new Date(2021, 6, 10),
  },
  {
    title: 'Conference',
    start: new Date(2021, 6, 20),
    end: new Date(2021, 6, 23),
  },
];

export default function EventCalendar() {
  //Aliasing as eventId, maybe we should just rename the param to eventId in App
  const { id: eventId } = useParams();
  const { loading, error, data } = useQuery(GET_EVENT, {
    variables: { id: eventId },
  });

  const [allAvailableAppts, setAvailableAppts] = useState([]);
  // TODO ^ change above to retrieve all available appts for this event

  useEffect(() => {
    // maybe we should unpack data? Not sure what the best pattern is for client side queries using apollo
    setAvailableAppts(data?.event?.timeslots || []);

    console.log(data);
    console.log(error);
  }, [error, data]);

  const eventUrl = 'Share link';
  //TODO: Maybe build out a button component that copys the current url to clipboard for sharing
  //TODO: Conditonally render OwnerCalendar based on Owner status

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" m={1}>
        <Typography variant="h4">{data?.event.title}</Typography>
        <Typography>{eventUrl}</Typography>
      </Box>

      <OwnerCalendar slots={allAvailableAppts} setSlots={setAvailableAppts} />
    </React.Fragment>
  );
}
