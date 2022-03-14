import './EventCalendar.css';
import { useState } from "react";
import { Container, Typography, Grid, Button} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enCA from 'date-fns/locale/en-CA'

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

const events = [
    {
        title: "Big Meeting",
        allDay: true,
        start: new Date(2021, 6, 0),
        end: new Date(2021, 6, 0),
    },
    {
        title: "Vacation",
        start: new Date(2021, 6, 7),
        end: new Date(2021, 6, 10),
    },
    {
        title: "Conference",
        start: new Date(2021, 6, 20),
        end: new Date(2021, 6, 23),
    },
];

export function EventCalendar() {

    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const [allEvents, setAllEvents] = useState(events);

    function handleAddEvent() {
        setAllEvents([...allEvents, newEvent]);
    }
       
    return (
    <Container className="EventCal__container">
        <Grid>
            <Typography className="EventCal__title">This Event</Typography>
            <Typography className="EventCal__link">Share link</Typography>
        </Grid>
        <Button variant="contained" href="/book_appt"><CalendarMonthIcon/>Book Appointment</Button>
        <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 500 }}/>
    </Container>
  );
}