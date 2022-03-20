import { Box, TextField, Button, Typography } from '@mui/material';
import sx from 'mui-sx';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enCA from 'date-fns/locale/en-CA';
import format from 'date-fns/format';
import { add, getUnixTime } from 'date-fns';
import { CREATE_SLOTS, DELETE_SLOT } from '../../graphql/mutations';
import { GET_EVENT } from '../../graphql/queries';
import { useMutation } from '@apollo/client';

export default function OwnerCalendar({
  slots,
  setSlots,
  eventId,
  timeslotLength,
}) {
  const [createSlots] = useMutation(CREATE_SLOTS, {
    refetchQueries: [GET_EVENT],
  });
  const [deleteSlot] = useMutation(DELETE_SLOT, {
    refetchQueries: [GET_EVENT],
  });
  const [seeSlot, setSeeSlot] = useState(false);
  const [seeSlotInfo, setSeeSlotInfo] = useState(false);
  const [slotInfo, setSlotInfo] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelect = ({ start, end }) => {
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
  };

  const viewSlot = ({ start, end, _id, bookerId }) => {
    setSelectedSlot(_id);
    if (bookerId) {
      const startWhen = format(start, 'E MMM dd yyyy, HH:mm');
      const endWhen = format(end, 'E MMM dd yyyy, HH:mm');
      const slInfo = {
        _id: _id,
        who: bookerId._id,
        when: startWhen + ' - ' + endWhen,
        cmnts: '',
      };
      setSlotInfo(slInfo);
      setSeeSlotInfo(true);
      setSeeSlot(false);
    } else {
      setSeeSlot(true);
      setSeeSlotInfo(false);
    }
  };

  const handleClose = (e) => {
    setSelectedSlot(null);
    setSlotInfo({});
    setSeeSlotInfo(false);
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
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={viewSlot}
      />
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
    </Box>
  );
}
