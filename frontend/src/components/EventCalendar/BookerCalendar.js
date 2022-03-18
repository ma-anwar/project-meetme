import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import format from 'date-fns/format';
import sx from 'mui-sx';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BOOK_SLOT } from '../../graphql/mutations';
import { GET_EVENT } from '../../graphql/queries';
import { useMutation } from '@apollo/client';

export default function BookerCalendar({ slots, setSlots, eventId }) {
  const [bookSlot, { data, loading, error }] = useMutation(BOOK_SLOT, {
    refetchQueries: [GET_EVENT],
  });

  const [book, setBook] = useState(false);
  const [cmnt, setCmnt] = useState('');
  const [when, setWhen] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { userProfile } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO rename slot title once booked (like "Booked-ID")
    const bookedSlot = {
      eventId: eventId,
      slotId: selectedSlot,
      //comment: e.target.appt_cmnts,
    };

    bookSlot({
      variables: { input: bookedSlot },
    });

    e.target.reset();
    setCmnt('');
    setBook(false);
  };

  const bookAppt = ({ start, end, _id, bookerId }) => {
    const startWhen = format(start, 'E MMM dd yyyy, HH:mm');
    const endWhen = format(end, 'E MMM dd yyyy, HH:mm');
    setSelectedSlot(_id);
    setWhen(startWhen + ' - ' + endWhen);
    setBook(true);
    //temp, to remove, just needed for now to check
    console.log('BOOKED BY');
    console.log(bookerId);
  };

  const handleCancel = (e) => {
    setSelectedSlot(null);
    setCmnt('');
    setBook(false);
  };

  const onCmntChange = (e) => {
    setCmnt(e.target.value);
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
        style={{ height: 500 }}
        selectable
        onSelectEvent={bookAppt}
      />
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
    </Box>
  );
}
