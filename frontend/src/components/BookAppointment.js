import './BookAppointment.css';
import { useState, useEffect } from 'react';
import sx from 'mui-sx';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
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

//Temporary, remove once retrieving appt info from BE
const appointments = [
  {
    title: 'Big Meeting',
    allDay: true,
    start: new Date(2022, 2, 0),
    end: new Date(2022, 2, 1),
  },
  {
    title: 'Vacation',
    start: new Date(2022, 2, 7),
    end: new Date(2022, 2, 10),
  },
  {
    title: 'Conference',
    start: new Date(2022, 2, 20),
    end: new Date(2022, 2, 23),
  },
];

const base = {
  margin: 1,
};

export function BookAppointment() {
  const [allAvailableAppts, setAvailableAppts] = useState(appointments);
  // TODO ^ change above to retrieve all available appts for this event
  const [book, setBook] = useState(false);
  const [cmnt, setCmnt] = useState('');
  const [who, setWho] = useState('Alice');
  //TODO ^ change above to actual logged in user
  const [when, setWhen] = useState(null);

  const eventTitle = 'This Event';
  //TODO ^ change above to retrieve event title from BE
  const eventDescription = 'Event Description';
  //TODO ^ change above to retrieve event description from BE

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    console.log('Booked');
    //TODO send info to backend to actually book slot
    //TODO, remove this slot from available slots
  };

  //TODO, change/chop format of start/end date
  //Cur: Thu Mar 10 2022 00:00:00 GMT-0500 (Eastern Standard Time)
  const bookAppt = ({ start, end }) => {
    setWhen(start + ' - ' + end);
    setBook(true);
    //console.log(format(start, "yyyy-MM-dd'T'HH:mm:ss.SSS"));
  };

  const handleCancel = (e) => {
    setCmnt('');
    setBook(false);
  };

  const onCmntChange = (e) => {
    setCmnt(e.target.value);
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography>{eventTitle}</Typography>
        <Typography>{eventDescription}</Typography>
      </Box>
      <Calendar
        localizer={localizer}
        events={allAvailableAppts}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectEvent={bookAppt}
      />
      {book ? (
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column">
            <TextField
              sx={sx(base)}
              placeholder="Who"
              name="appt_booker"
              value={who}
              disabled
            />
            <TextField
              sx={sx(base)}
              placeholder="When"
              name="appt_time"
              value={when}
              disabled
            />
            <TextField
              sx={sx(base)}
              placeholder="Comments"
              name="appt_cmnts"
              value={cmnt}
              onChange={onCmntChange}
              multiline
              rows={5}
            />
            <Button sx={sx(base)} type="submit" variant="contained">
              Book
            </Button>
            <Button
              csx={sx(base)}
              type="button"
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </form>
      ) : null}
    </Container>
  );
}
