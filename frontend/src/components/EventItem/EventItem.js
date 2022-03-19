import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
export default function EventItem({ id, title, startDate, endDate }) {
  // Implement delete event functionality
  const navigate = useNavigate();
  const secondary = `${new Date(startDate * 1000)} to ${new Date(
    endDate * 1000
  )}`;
  return (
    <ListItem>
      <ListItemButton onClick={() => navigate(`/cal/${id}`)}>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary={title} secondary={secondary} />
      </ListItemButton>
    </ListItem>
  );
}
