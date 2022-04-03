import { Box, TextField, Button, Typography } from '@mui/material';
import sx from 'mui-sx';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import format from 'date-fns/format';
import { add, getUnixTime, isBefore } from 'date-fns';
import { CREATE_SLOTS, DELETE_SLOT } from '../../graphql/mutations';
import { GET_EVENT } from '../../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';

export default function OwnerCalendar({
  slots,
  setSlots,
  eventId,
  timeslotLength,
  isOwner,
}) {
  const [createSlots] = useMutation(CREATE_SLOTS, {
    refetchQueries: [GET_EVENT],
  });
  const [deleteSlot] = useMutation(DELETE_SLOT, {
    refetchQueries: [GET_EVENT],
  });

  const callEnded = 'Call Ended';
  const [seeSlot, setSeeSlot] = useState(false);
  const [seeSlotInfo, setSeeSlotInfo] = useState(false);
  const [slotInfo, setSlotInfo] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [bookerJoined, setBookerJoined] = useState(false);
  const navigate = useNavigate();

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
      });
    }
  };

  const viewSlot = ({ start, end, _id, bookerId, peerId, comment }) => {
    setSelectedSlot(_id);
    console.log('THE TS ID ' + selectedSlot);
    if (bookerId) {
      const startWhen = format(start, 'E MMM dd yyyy, HH:mm');
      const endWhen = format(end, 'E MMM dd yyyy, HH:mm');
      const slInfo = {
        _id: _id,
        who: bookerId._id,
        when: startWhen + ' - ' + endWhen,
        cmnts: comment,
        peerIn: peerId ? peerId : null,
      };
      setBookerJoined(peerId != null);
      console.log('EH BUT');
      console.log(peerId);
      setSlotInfo(slInfo);
      setSeeSlotInfo(true);
      setSeeSlot(false);
    } else {
      setSeeSlot(true);
      setSeeSlotInfo(false);
      setBookerJoined(false);
    }
  };

  const eventPropGetter = (event) => {
    let backgroundColor = '';
    if (event.peerId == null || event.peerId == callEnded) {
      backgroundColor = '';
    } else {
      backgroundColor = 'green';
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
        views={['week', 'day']}
        style={{ height: 500 }}
        step={timeslotLength}
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={viewSlot}
        eventPropGetter={eventPropGetter}
      />
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
