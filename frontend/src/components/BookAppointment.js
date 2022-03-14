import './BookAppointment.css';
import { useState, useEffect } from "react";
import { Container, Typography, Grid, TextField, Button} from '@mui/material';
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
        start: new Date(2022, 2, 0),
        end: new Date(2022, 2, 1),
    },
    {
        title: "Vacation",
        start: new Date(2022, 2, 7),
        end: new Date(2022, 2, 10),
    },
    {
        title: "Conference",
        start: new Date(2022, 2, 20),
        end: new Date(2022, 2, 23),
    },
];

export function BookAppointment() {

    //const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const [allEvents, setAllEvents] = useState(events);

    // const [bookingDate, setBookingDate] = useState(null);
    // const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    // const [bookingTimes, setBookingTimes] = useState([]);

    // useEffect(() => {
    //     setBookingTimes(times);
    // }, [bookingDate])
    
    // const onDateChange = e => {
    //     setSelectedTimeSlot(null);
    //     setBookingDate(e.value);
    //   };

    const handleSubmit = (e) => {
        e.preventDefault();
        //e.target.reset();
    };

    const handleSelect = ({ start, end }) => {
        const title = window.prompt('New Event name')
        console.log(start);
        console.log(end);
        if (title){
          const newEvent = {title, start, end}
          setAllEvents([...allEvents, newEvent]);
        }
      }

       
    return (
    <Container className="BookAppt__container">
        <Grid>
            <Typography className="BookAppt__title">This Event</Typography>
            <Typography className="BookAppt__description">Event Description</Typography>
        </Grid>
        <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 500 }} 
        selectable  onSelectEvent={event => alert(event.title)} onSelectSlot={handleSelect} />
        <Grid>
        <form className="BookAppt" onSubmit={handleSubmit}>
            <TextField className="BookAppt__who" placeholder="Who" name="appt_booker" required/>
            <TextField className="BookAppt__when" placeholder="When" name="appt_time" required/>
            <TextField className="BookAppt__comments" placeholder="Comments" name="appt_cmnts" multiline rows={5}/>
            <Button className="BookAppt_btn" type="submit" variant="contained">Book</Button>
            <Button className="BookAppt_btn" type="button" variant="outlined">Cancel</Button>
        </form>
        </Grid>  
    </Container>
  );
}