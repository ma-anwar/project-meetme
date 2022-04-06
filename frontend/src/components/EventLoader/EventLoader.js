import { Typography, Box, CircularProgress, List } from '@mui/material';
import EventItem from '../EventItem/EventItem';
import { GET_EVENTS } from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import React, {useState} from 'react';

export default function EventLoader({email}) {
    const [page, setPage] = useState(0)
  const { data, refetch } = useQuery(GET_EVENTS, {
      variables: {email, page},
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
  }

  return (
    <React.Fragment>
      <Typography variant="h5" m={2}>
        Here's what you've got coming up
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
    </React.Fragment>
  );
}
