import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();

  const [emailErr, setEmailErr] = useState({
    show: false,
    message: '',
  });
  const [passwordErr, setPasswordErr] = useState({
    show: false,
    message: '',
  });

  const validateForm = (email, password) => {
    let errorExists = false;

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

    return errorExists;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [email, password] = [e.target.email.value, e.target.password.value];
    const hasErrors = validateForm(email, password);
    if (!hasErrors) {
      login(email, password);
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          placeholder="Enter your email"
          name="email"
          required
          sx={{ m: 1 }}
          error={emailErr.show}
          helperText={emailErr.message}
          onChange={clearEmailErr}
        />
        <TextField
          placeholder="Enter your password"
          name="password"
          type="password"
          required
          sx={{ m: 1 }}
          error={passwordErr.show}
          helperText={passwordErr.message}
          onChange={clearPasswordErr}
        />
        <Button type="submit" variant="contained" sx={{ m: 1 }}>
          Log in
        </Button>
      </Box>
    </form>
  );
}
