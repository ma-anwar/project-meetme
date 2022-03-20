import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card } from '@mui/material';
import { useAuth } from '../../hooks/useAuth.js';

export default function SignupForm() {
  const { signup } = useAuth();

  const [usernameErr, setUsernameErr] = useState({
    show: false,
    message: '',
  });
  const [emailErr, setEmailErr] = useState({
    show: false,
    message: '',
  });
  const [passwordErr, setPasswordErr] = useState({
    show: false,
    message: '',
  });
  const [cPasswordErr, setCPasswordErr] = useState({
    show: false,
    message: '',
  });

  const validateForm = (username, email, password, cpassword) => {
    let errorExists = false;

    if (!username) {
      setUsernameErr({
        show: true,
        message: 'Username is required',
      });
      errorExists = true;
    } else if (username.length < 3 || username.length > 50) {
      setUsernameErr({
        show: true,
        message: 'Username must be between 3-50 characters',
      });
      errorExists = true;
    }

    if (!email) {
      setEmailErr({
        show: true,
        message: 'Email is required',
      });
      errorExists = true;
    } else if (email.length > 50) {
      setEmailErr({
        show: true,
        message: 'Email must be less than 50 characters',
      });
      errorExists = true;
    }

    if (!password) {
      setPasswordErr({
        show: true,
        message: 'Password is required',
      });
      errorExists = true;
    } else if (password.length < 6 || password.length > 50) {
      setPasswordErr({
        show: true,
        message: 'Password must be between 6-50 characters',
      });
      errorExists = true;
    }

    if (!cpassword) {
      setCPasswordErr({
        show: true,
        message: 'Password Confirmation is required',
      });
      errorExists = true;
    } else if (cpassword !== password) {
      setCPasswordErr({
        show: true,
        message: 'Passwords do not match!',
      });
      errorExists = true;
    }
    return errorExists;
  };

  const clearUsernameErr = () => {
    setUsernameErr({
      show: false,
      message: '',
    });
  };

  const clearEmailErr = () => {
    setEmailErr({
      show: false,
      message: '',
    });
  };

  const clearPasswordErr = () => {
    setPasswordErr({
      show: false,
      message: '',
    });
  };

  const clearCPasswordErr = () => {
    setCPasswordErr({
      show: false,
      message: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [username, email, password, confirm] = [
      e.target.username.value,
      e.target.email.value,
      e.target.password.value,
      e.target.confirm.value,
    ];
    const hasErrors = validateForm(username, email, password, confirm);
    if (!hasErrors) {
      signup(username, email, password);
      e.target.reset();
    }
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
              error={usernameErr.show}
              helperText={usernameErr.message}
              onChange={clearUsernameErr}
            />
            <TextField
              sx={{ m: 1 }}
              placeholder="Email"
              name="email"
              required
              error={emailErr.show}
              helperText={emailErr.message}
              onChange={clearEmailErr}
            />
            <TextField
              sx={{ m: 1 }}
              placeholder="Password"
              name="password"
              type="password"
              required
              error={passwordErr.show}
              helperText={passwordErr.message}
              onChange={clearPasswordErr}
            />
            <TextField
              sx={{ m: 1 }}
              placeholder="Confirm Password"
              name="confirm"
              type="password"
              required
              error={cPasswordErr.show}
              helperText={cPasswordErr.message}
              onChange={clearCPasswordErr}
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
