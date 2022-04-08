import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import format from 'date-fns/format';
import { isBefore, differenceInMinutes, add } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import sx from 'mui-sx';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BOOK_SLOT, UNBOOK_SLOT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { useSubscribeToMore } from '../../hooks/useSubscribeToMore';

export default function BookerCalendar({
  slots,
  eventId,
  timeslotLength,
  isOwner,
  subToUpdates,
  defaultDate,
  onRangeChange,
}) {
  useSubscribeToMore(subToUpdates);
  const [bookSlot] = useMutation(BOOK_SLOT);
  const [unbookSlot] = useMutation(UNBOOK_SLOT);

  const [book, setBook] = useState(false);
  const [unBook, setUnBook] = useState(false);
  const [cmnt, setCmnt] = useState('');
  const [when, setWhen] = useState(null);
  const [whenStart, setWhenStart] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showStartCall, setStartCall] = useState(false);
  const navigate = useNavigate();

  const { userProfile } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookedSlot = {
      eventId: eventId,
      slotId: selectedSlot,
      title: 'Booked-' + userProfile.username,
      comment: e.target.appt_cmnts.textContent,
    };

    bookSlot({
      variables: { input: bookedSlot },
    });

    e.target.reset();
    setCmnt('');
    setBook(false);
    setUnBook(true);
  };

  const bookAppt = ({ start, end, _id, bookerId, comment }) => {
    const today = new Date();
    const bufferTime = add(start, { minutes: timeslotLength });
    if (isBefore(start, today) && isBefore(bufferTime, today)) {
      setShowError(true);
      setBook(false);
      setUnBook(false);
      setStartCall(false);
    } else {
      setShowError(false);
      const startWhen = format(start, 'E MMM dd yyyy, HH:mm');
      const endWhen = format(end, 'E MMM dd yyyy, HH:mm');
      setSelectedSlot(_id);
      setWhenStart(startWhen);
      setWhen(startWhen + ' - ' + endWhen);
      comment ? setCmnt(comment) : setCmnt('');
      if (bookerId && bookerId._id === userProfile._id) {
        setUnBook(true);
        setBook(false);
        if (
          differenceInMinutes(start, new Date()) > -timeslotLength &&
          differenceInMinutes(start, new Date()) < 300
        ) {
          setStartCall(true);
        } else {
          setStartCall(false);
        }
      } else {
        setBook(true);
        setUnBook(false);
        setStartCall(false);
      }
    }
  };

  const handleCancelPreBook = (e) => {
    setSelectedSlot(null);
    setCmnt('');
    setBook(false);
  };

  const onCmntChange = (e) => {
    setCmnt(e.target.value);
  };

  const handleCancelBooking = (e) => {
    e.preventDefault();
    const bookedSlot = {
      eventId: eventId,
      slotId: selectedSlot,
      title: 'Empty slot',
      comment: '',
    };

    unbookSlot({
      variables: { input: bookedSlot },
    });

    setCmnt('');
    setUnBook(false);
  };

  const handleClose = () => {
    setSelectedSlot(null);
    setUnBook(false);
  };

  const eventPropGetter = (event) => {
    const today = new Date();
    const bufferTime = add(event.start, { minutes: timeslotLength });
    let backgroundColor = '';
    if (event.bookerId == null || isBefore(bufferTime, today)) {
      backgroundColor = '';
    } else {
      backgroundColor = 'green';
    }
    return { style: { backgroundColor } };
  };

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

  const base = {
    margin: 1,
  };

  return (
    <Box>
      <Calendar
        localizer={localizer}
        events={slots}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        defaultDate={defaultDate}
        views={['week', 'day']}
        style={{ height: 500 }}
        step={timeslotLength}
        onSelectEvent={bookAppt}
        eventPropGetter={eventPropGetter}
        onRangeChange={onRangeChange}
      />
      {showError ? (
        <Typography variant="h6" align="center" p={1}>
          Sorry, you cannot book an appointment that has passed.
        </Typography>
      ) : null}
      {book ? (
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column">
            <TextField
              sx={sx(base)}
              inputProps={{ style: { fontWeight: 'bold' } }}
              label="Who"
              name="appt_booker"
              value={userProfile.username}
              disabled
            />
            <TextField
              sx={sx(base)}
              inputProps={{ style: { fontWeight: 'bold' } }}
              label="When"
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
              sx={sx(base)}
              type="button"
              variant="outlined"
              onClick={handleCancelPreBook}
            >
              Cancel
            </Button>
          </Box>
        </form>
      ) : null}
      {unBook ? (
        <Box display="flex" flexDirection="column">
          <Typography align="center" style={{ color: 'green' }} p={1}>
            You have successfully booked this timeslot.
          </Typography>
          <Typography align="center" p={1}>
            Please come back at {whenStart} to start the call.
          </Typography>
          <TextField
            sx={sx(base)}
            inputProps={{ style: { fontWeight: 'bold' } }}
            label="Who"
            name="appt_booker"
            value={userProfile.username}
            disabled
          />
          <TextField
            sx={sx(base)}
            inputProps={{ style: { fontWeight: 'bold' } }}
            label="When"
            name="appt_time"
            value={when}
            disabled
          />
          <TextField
            sx={sx(base)}
            inputProps={{ style: { fontWeight: 'bold' } }}
            placeholder="Comments"
            name="appt_cmnts"
            value={cmnt}
            multiline
            rows={5}
            disabled
          />
        </Box>
      ) : null}
      {unBook && !showStartCall ? (
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Button
            sx={sx(base)}
            type="button"
            variant="contained"
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </Button>
          <Button
            sx={sx(base)}
            type="button"
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      ) : null}
      {showStartCall ? (
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Button
            sx={sx(base)}
            type="button"
            variant="contained"
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </Button>
          <Button
            sx={sx(base)}
            type="button"
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            sx={{
              margin: 1,
              backgroundColor: 'green',
            }}
            type="button"
            variant="contained"
            onClick={() =>
              navigate('/video_call/' + eventId + '/' + selectedSlot, {
                state: { ownIt: isOwner },
              })
            }
          >
            Start Call
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
