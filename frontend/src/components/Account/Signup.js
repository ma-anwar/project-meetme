import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth.js';
import { API } from '../../utils/constants';
import axios from 'axios';

export default function SignupForm() {
  const { setLoggedIn, redirect, refetch } = useAuth();

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

  const signup = async (username, email, password) => {
    try {
      const resp = await axios.post(`${API}/api/auth/signup`, {
        username,
        email,
        password,
      });
      await refetch();
      setLoggedIn(true);
      redirect();
    } catch (err) {
      setLoggedIn(false);
      document.querySelector('#error_box').innerHTML = err;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" m={1}>
      <Typography variant="h6" align="center" p={1}>
        Struggling to setup appointments with people and keep track of them?
      </Typography>
      <Typography variant="body1" align="center" p={1}>
        Use MeetMe and let others schedule when it works for you!
        <br /> When it's time to meet, simply click the link to join a video
        call.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" alignItems="center" p={1}>
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
          <Typography id="error_box" style={{ color: 'red' }}></Typography>
        </Box>
      </form>
    </Box>
  );
}
