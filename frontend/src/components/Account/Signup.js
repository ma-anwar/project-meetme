import React from 'react';
import { TextField, Button, Box, Typography, Card } from '@mui/material';
import { useAuth } from '../../hooks/useAuth.js';

export default function SignupForm() {
  const { signup } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    const [username, email, password, confirm] = [
      e.target.username.value,
      e.target.email.value,
      e.target.password.value,
      e.target.confirm.value,
    ];
    signup(username, email, password);

    e.target.reset();
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" m={1}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              sx={{ m: 1 }}
              placeholder="Username"
              name="username"
              required
            />
            <TextField
              sx={{ m: 1 }}
              placeholder="Email"
              name="email"
              required
            />
            <TextField
              sx={{ m: 1 }}
              placeholder="Password"
              name="password"
              type="password"
              required
            />
            <TextField
              sx={{ m: 1 }}
              placeholder="Confirm Password"
              name="confirm"
              required
            />
            <Button type="submit" variant="contained" sx={{ m: 1 }}>
              Sign up
            </Button>
          </Box>
        </form>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center" m={2}>
        <Card>
          <Typography variant="body1" align="center" gutterBottom={true}>
            Have you ever struggled to book appointments with multiple people
            and keep track of them?
          </Typography>
          <Typography variant="body2" align="center">
            Well, look no further. MeetMe is an application that allows users to
            create calendars and book appointments with other users. When it's
            time to meet, simply click the link to join the video call.
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
