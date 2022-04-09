import * as React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/Account/Login';
import SignupForm from './components/Account/Signup';
import NavBar from './components/NavBar/NavBar';
import Profile from './components/Profile/Profile';
import CreateEvent from './components/CreateEvent/CreateEvent';
import EventCalWrapper from './components/EventCalendar/EventCalWrapper';
import VideoCall from './components/EventCalendar/VideoCall';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const { authReady, loggedIn } = useAuth();
  if (!authReady) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        {' '}
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
            path="/cal/:id"
            element={
              <ProtectedRoute>
                <EventCalWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video_call/:eventId/:tsId"
            element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              loggedIn ? (
                <Navigate replace to="/profile" />
              ) : (
                <Navigate replace to="/signup" />
              )
            }
          />
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;
