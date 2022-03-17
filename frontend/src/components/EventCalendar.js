import './EventCalendar.css';
import { useState } from 'react';
import sx from 'mui-sx';
import { Container, Typography, Box, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import add from 'date-fns/add';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';

const locales = {
  'en-CA': enCA,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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

const base = {
  margin: 1,
};

export function EventCalendar() {
  const [allAvailableAppts, setAvailableAppts] = useState(appointments);
  // TODO ^ change above to retrieve all available appts for this event

  const eventTitle = 'This Event';
  //TODO ^ change above to retrieve event title from BE
  const eventUrl = 'Share link';
  //TODO ^ change above to retrieve url from BE

  const handleSelect = ({ start, end }) => {
    const slotLength = 30; //TODO, change to retrieve from BE
    const title = eventTitle;
    console.log(start);
    console.log(end);

    //const title = window.prompt('New Event name');
    // if (title) {
    //   const newEvent = { title, start, end };
    //   setAvailableAppts([...allAvailableAppts, newEvent]);
    // }
    // ^ with something like this, the event shows up on screen, but below doesn't

    let startTime = start;
    let endTime = end;

    while (startTime < endTime) {
      const finTime = add(startTime, { minutes: slotLength });
      const newSlot = { title, startTime, finTime };
      setAvailableAppts([...allAvailableAppts, newSlot]);
      startTime = finTime;
    }
    console.log(allAvailableAppts);
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={sx(base)}
      >
        <Typography>{eventTitle}</Typography>
        <Typography>{eventUrl}</Typography>
        {/* TODO, remove below once we have a way for Bob to view Alice's calendar and book appt */}
        <Button variant="contained" href="/book_appt">
          <CalendarMonthIcon />
          Book Appointment
        </Button>
      </Box>

      <Calendar
        localizer={localizer}
        events={allAvailableAppts}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        sx={{ margin: 2 }}
        selectable
        onSelectSlot={handleSelect}
      />
    </Container>
  );
}
