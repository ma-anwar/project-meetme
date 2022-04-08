import { Box, TextField, Button, Typography } from '@mui/material';
import sx from 'mui-sx';
import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import format from 'date-fns/format';
import { add, getUnixTime, isBefore } from 'date-fns';
import { CREATE_SLOTS, DELETE_SLOT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { useSubscribeToMore } from '../../hooks/useSubscribeToMore';

export default function OwnerCalendar({
  slots,
  eventId,
  timeslotLength,
  isOwner,
  subToUpdates,
  defaultDate,
  onRangeChange,
}) {
  useSubscribeToMore(subToUpdates);

  const [createSlots] = useMutation(CREATE_SLOTS);
  const [deleteSlot] = useMutation(DELETE_SLOT);

  const [seeSlot, setSeeSlot] = useState(false);
  const [seeSlotInfo, setSeeSlotInfo] = useState(false);
  const [slotInfo, setSlotInfo] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [error, setError] = useState('');
  const [bookerJoined, setBookerJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;
    const errorTimer = setTimeout(() => {
      setError('');
    }, 3000);
    return () => {
      clearTimeout(errorTimer);
    };
  }, [error]);

  const handleSelect = ({ start, end }) => {
    const today = new Date();
    if (isBefore(start, today)) {
      setTooEarly(true);
    } else {
      setTooEarly(false);
      const slotLength = timeslotLength;

      let startTime = start;
      let endTime = end;
      const newSlots = [];

      while (startTime < endTime) {
        const finTime = add(startTime, { minutes: slotLength });
        const newSlot = {
          title: 'Empty slot',
          start: `${getUnixTime(startTime)}`,
          end: `${getUnixTime(finTime)}`,
        };
        newSlots.push(newSlot);
        startTime = finTime;
      }
      createSlots({
        variables: { input: { eventId: eventId, slots: newSlots } },
      }).catch(() => {
        setError(
          'Timeslots must be between the start and end date of the event'
        );
      });
    }
  };

  const viewSlot = ({
    start,
    end,
    _id,
    bookerId,
    peerId,
    peerCallEnded,
    comment,
  }) => {
    setSelectedSlot(_id);
    if (bookerId) {
      const startWhen = format(start, 'E MMM dd yyyy, HH:mm');
      const endWhen = format(end, 'E MMM dd yyyy, HH:mm');
      const slInfo = {
        _id: _id,
        who: bookerId.username,
        when: startWhen + ' - ' + endWhen,
        cmnts: comment ? comment : '',
        peerIn: peerId ? peerId : null,
        peerCallEnded: peerCallEnded,
      };
      setBookerJoined(peerId != null);
      console.log('on owner side ' + peerId);
      console.log(slInfo);
      setSlotInfo(slInfo);
      setSeeSlotInfo(true);
      setSeeSlot(false);
    } else {
      setSeeSlot(true);
      setSeeSlotInfo(false);
      setBookerJoined(false);
    }
    console.log('owner owner');
    console.log(peerId == '');
    console.log(peerId == null);
  };

  const eventPropGetter = (event) => {
    let backgroundColor = '';
    console.log('still owner, but color ' + event.peerId);
    if (event.peerId) {
      backgroundColor = 'green';
    } else {
      backgroundColor = '';
    }
    return { style: { backgroundColor } };
  };

  const handleClose = (e) => {
    setSelectedSlot(null);
    setSlotInfo({});
    setSeeSlotInfo(false);
    setBookerJoined(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();

    const unbookedSlot = {
      eventId: eventId,
      slotId: selectedSlot,
    };

    deleteSlot({
      variables: { input: unbookedSlot },
    });
    setSeeSlot(false);
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
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={viewSlot}
        eventPropGetter={eventPropGetter}
        onRangeChange={onRangeChange}
      />

      {error ? (
        <Typography align="center" style={{ color: 'red' }}>
          {error}
        </Typography>
      ) : null}
      {tooEarly ? (
        <Typography align="center" style={{ color: 'red' }}>
          Please select a start time in the future.
        </Typography>
      ) : null}
      {seeSlot ? (
        <Box display="flex" alignItems="center" flexDirection="column" m={1}>
          <Typography variant="body1">
            Would you like to delete this slot?
          </Typography>
          <Button
            sx={sx(base)}
            type="button"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      ) : null}
      {seeSlotInfo ? (
        <Box display="flex" flexDirection="column">
          <TextField
            sx={sx(base)}
            inputProps={{ style: { fontWeight: 'bold' } }}
            label="Who"
            name="appt_booker"
            value={slotInfo.who}
            disabled
          />
          <TextField
            sx={sx(base)}
            inputProps={{ style: { fontWeight: 'bold' } }}
            label="When"
            name="appt_time"
            value={slotInfo.when}
            disabled
          />
          <TextField
            sx={sx(base)}
            placeholder="Comments"
            name="appt_cmnts"
            value={slotInfo.cmnts}
            multiline
            rows={5}
            disabled
          />
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
      {seeSlotInfo && bookerJoined ? (
        <Box display="flex" flexDirection="column">
          <Button
            sx={sx(base)}
            type="button"
            variant="contained"
            onClick={() =>
              navigate('/video_call/' + eventId + '/' + selectedSlot, {
                state: { ownIt: isOwner },
              })
            }
          >
            Join Room
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
