import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import EventLoader from '../EventLoader/EventLoader';

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
      <Button variant="contained" onClick={() => navigate('/create_event')}>
        <AddIcon />
        Create Event
      </Button>
      <EventLoader email={userProfile.email} />
    </Box>
  );
}
