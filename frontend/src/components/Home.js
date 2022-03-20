import { Container, Typography, Card, CardContent } from '@mui/material';

export function Home() {
    return (
    <Container className="info">
        <Card>
        <CardContent>
            <Typography variant="h5">
            Have you ever struggled to book appointments with multiple people and keep track of them?
            </Typography>
            <Typography variant="h5">
            Well, look no further. MeetMe is an application that allows users to create calendars and book appointments with other users. 
            When it's time to meet, simply click the link to join the video call.
            </Typography>
        </CardContent>
        </Card>
    </Container>
  );
}
