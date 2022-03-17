import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  //TODO: Add error handling, hide password
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
    e.target.reset();
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          placeholder="Enter your email"
          name="email"
          required
          sx={{ m: 1 }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          placeholder="Enter your password"
          name="password"
          required
          sx={{ m: 1 }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button type="submit" variant="contained" sx={{ m: 1 }}>
          Log in
        </Button>
      </Box>
    </form>
  );
}
