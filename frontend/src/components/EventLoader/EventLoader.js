import { Typography, Box, CircularProgress, List, Button } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import EventItem from '../EventItem/EventItem';
import { GET_EVENTS } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';

export default function EventLoader({ email }) {
  const [page, setPage] = useState(0);
  const { data, refetch } = useQuery(GET_EVENTS, {
    variables: { email, page },
    fetchPolicy: 'network-only',
  });

  if (!data) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (data.eventsOwned.events.length === 0 && page === 0) {
    return (
      <Typography variant="h5" m={2}>
        Looks like you haven't created any events yet!
      </Typography>
    );
  } else if (data.eventsOwned.events.length === 0 && page > 0) {
    setPage(page - 1);
  }

  const prevPg = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const nextPg = () => {
    console.log(data.eventsOwned);
    if (data.eventsOwned.hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h5" m={2}>
        Here's what you have coming up:
      </Typography>
      <List>
        {data.eventsOwned.events.map((evt) => (
          <EventItem
            key={evt._id}
            id={evt._id}
            title={evt.title}
            startDate={evt.startDate}
            endDate={evt.endDate}
            refetch={refetch}
          />
        ))}
      </List>
      {data.eventsOwned.events.length !== 0 ? (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            onClick={prevPg}
            sx={{ mr: 20 }}
            disabled={page === 0}
          >
            <NavigateBefore />
          </Button>
          <Box></Box>
          <Button
            variant="contained"
            onClick={nextPg}
            sx={{ ml: 20 }}
            disabled={!data.eventsOwned.hasMore}
          >
            <NavigateNext />
          </Button>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
