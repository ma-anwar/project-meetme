import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from './components/account/Login';
import { SignupForm } from './components/account/Signup';
import NavBar from './components/NavBar/NavBar';
import { Profile } from './components/Profile/Profile';
import { CreateEvent } from './components/CreateEvent';
import { EventCalendar } from './components/EventCalendar';
import { BookAppointment } from './components/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const { authReady } = useAuth();
  if (!authReady) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <React.Fragment>
        <header>
          <NavBar />
        </header>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create_event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event_cal"
            element={
              <ProtectedRoute>
                <EventCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book_appt"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;
