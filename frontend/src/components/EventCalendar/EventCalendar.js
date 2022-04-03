import { Typography, Box, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OwnerCalendar from './OwnerCalendar';
import BookerCalendar from './BookerCalendar';
import {
  GET_EVENT,
  GET_TIMESLOTS,
  GET_TIMESLOTS_IN_RANGE,
} from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import fromUnixTime from 'date-fns/fromUnixTime';

export default function EventCalendar({
  ownerId,
  title,
  description,
  timeslotLength,
  eventId,
  startDate,
  endDate,
}) {
  const [dateRange, setDateRange] = useState({
    start: startDate,
    end: endDate,
  });

  const {
    data: dataTS,
    error: errorTS,
    refetch: refetchTS,
  } = useQuery(GET_TIMESLOTS_IN_RANGE, {
    variables: {
      input: { eventId, start: dateRange.start, end: dateRange.end },
    },
  });

  const { userProfile } = useAuth();
  let isOwner = ownerId?._id === userProfile._id;

  const [allAvailableAppts, setAvailableAppts] = useState([]);

  useEffect(() => {
    if (dataTS) {
      const formattedDates = dataTS?.getSlotsBetween?.map((slot) => ({
        start: fromUnixTime(slot.start),
        end: fromUnixTime(slot.end),
        title: slot.title,
        _id: slot._id,
        comment: slot.comment,
        bookerId: slot.bookerId,
        peerId: slot.peerId,
      }));

      if (isOwner) {
        setAvailableAppts(formattedDates || []);
      } else {
        const newFormattedDates = [];
        for (let i = 0; i < formattedDates.length; i++) {
          if (
            !formattedDates[i].bookerId ||
            formattedDates[i].bookerId._id === userProfile._id
          ) {
            newFormattedDates.push(formattedDates[i]);
          }
        }
        setAvailableAppts(newFormattedDates || []);
      }
    }
    const interval = setInterval(() => {
      refetchTS();
    }, 3000);
    return () => clearInterval(interval);
  }, [isOwner, userProfile._id, errorTS, dataTS, refetchTS]);

  const eventUrl = window.location.href;

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" m={1}>
        <Typography variant="h4">{title}</Typography>
        {isOwner ? (
          <Box>
            <Typography>
              Share Link: <Link href={eventUrl}>{eventUrl}</Link>
            </Typography>
            <Typography>{description}</Typography>
          </Box>
        ) : (
          <Typography>{description}</Typography>
        )}
      </Box>
      {isOwner ? (
        <OwnerCalendar
          slots={allAvailableAppts}
          setSlots={setAvailableAppts}
          eventId={eventId}
          timeslotLength={timeslotLength}
          isOwner={isOwner}
        />
      ) : null}
      {!isOwner ? (
        <BookerCalendar
          slots={allAvailableAppts}
          setSlots={setAvailableAppts}
          eventId={eventId}
          timeslotLength={timeslotLength}
          isOwner={isOwner}
        />
      ) : null}
    </React.Fragment>
  );
}
