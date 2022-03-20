import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DELETE_EVENT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

export default function EventItem({ id, title, startDate, endDate }) {
  const [deleteEvent] = useMutation(DELETE_EVENT);
  const navigate = useNavigate();
  const secondary = `${new Date(startDate * 1000)} to ${new Date(
    endDate * 1000
  )}`;

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    const deletingEvent = {
      eventId: id,
    };
    deleteEvent({
      variables: { input: deletingEvent },
    });
  };

  return (
    <ListItem>
      <Box display="flex" flexDirection="row">
        <ListItemButton onClick={() => navigate(`/cal/${id}`)}>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary={title} secondary={secondary} />
        </ListItemButton>
        <ListItemButton onClick={handleDeleteEvent}>
          <ListItemIcon>
            <DeleteForeverIcon style={{ color: 'red', fontSize: 40 }} />
          </ListItemIcon>
        </ListItemButton>
      </Box>
    </ListItem>
  );
}
