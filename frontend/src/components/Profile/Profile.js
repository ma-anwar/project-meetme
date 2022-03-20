import { Typography, Button, List, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventItem from '../EventItem/EventItem';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      m={2}
    >
      <Typography variant="h4" m={2}>
        Hey {userProfile.username}!
      </Typography>
      <Typography variant="h5" m={2}>
        Here's what you've got coming up
      </Typography>
      <List>
        {userProfile.eventsOwned.map((evt) => (
          <EventItem
            key={evt._id}
            id={evt._id}
            title={evt.title}
            startDate={evt.startDate}
            endDate={evt.endDate}
          />
        ))}
      </List>
      <Button variant="contained" onClick={() => navigate('/create_event')}>
        <AddIcon />
        Create Event
      </Button>
    </Box>
  );
}
