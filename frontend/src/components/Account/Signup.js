import React from 'react';
import { TextField, Button, Box } from '@mui/material';
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
    <Box display="flex" flexDirection="column" alignItems="center">
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            sx={{ m: 1 }}
            placeholder="Username"
            name="username"
            required
          />
          <TextField sx={{ m: 1 }} placeholder="Email" name="email" required />
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
  );
}
