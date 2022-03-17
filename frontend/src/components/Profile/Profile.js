import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAuth } from '../../hooks/useAuth';
//TODO: Create an event component, that represents the info from one event
//TODO: Create an event list component that will take an array of events and display them, will need pagination implemented in the future

export function Profile() {
  const { userProfile } = useAuth();
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
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Halal trip to Vancouver" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Bday week" />
          </ListItemButton>
        </ListItem>
      </List>
      <Button variant="contained" href="/create_event">
        <AddIcon />
        Create Event
      </Button>
    </Box>
  );
}

