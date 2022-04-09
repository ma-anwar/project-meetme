import { GET_EVENT } from '../../graphql/queries';
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';
import EventCalendar from './EventCalendar';

export default function EventCalWrapper() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const { loading, data, error } = useQuery(GET_EVENT, {
    variables: { id: eventId },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    setTimeout(() => {
      navigate('/profile/');
    }, 500);

    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography align="center" style={{ color: 'red' }}>
          This calendar does not exist. Redirecting...
        </Typography>
      </Box>
    );
  }
  return (
    <React.Fragment>
      <EventCalendar {...data.event} eventId={eventId} />
    </React.Fragment>
  );
}
