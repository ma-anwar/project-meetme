import './EventCalendar.css';
import { Container, Typography, Grid} from '@mui/material';

export function EventCalendar() {
       
    return (
    <Container className="EventCal__container">
        <Grid>
            <Typography className="EventCal__title">This Event</Typography>
            <Typography className="EventCal__link">Share link</Typography>
        </Grid>
    </Container>
  );
}