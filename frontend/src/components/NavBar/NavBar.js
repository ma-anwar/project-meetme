import * as React from 'react';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function NavBar() {
  const { loggedIn, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <CalendarMonthIcon
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          ></CalendarMonthIcon>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MeetMe
          </Typography>
          {loggedIn ? (
            <React.Fragment>
              <Button color="inherit" component={Link} to={'/create_event'}>
                Create Event
              </Button>
              <Button color="inherit" component={Link} to={'/profile'}>
                Profile
              </Button>
              <Button
                color="inherit"
                component={Link}
                to={'/login'}
                onClick={logout}
              >
                Logout
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button color="inherit" component={Link} to={'/login'}>
                Login
              </Button>
              <Button color="inherit" component={Link} to={'/signup'}>
                Signup
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
