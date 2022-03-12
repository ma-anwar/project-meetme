import './Profile.css';
import { Container, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


export function Profile() {
    return (
    <Container className="Profile">
        <Typography variant="h3">Username</Typography>
        <Container className="Profile_cal-owned">
            <Typography variant="h5">Calendar's Owned</Typography>
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon><CalendarMonthIcon/></ListItemIcon>
                        <ListItemText primary="Calendar1"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon><CalendarMonthIcon/></ListItemIcon>
                        <ListItemText primary="Calendar2"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Container>
        <Button variant="contained" href="/create_event"><AddIcon/>Create Event</Button>
    </Container>
  );
}