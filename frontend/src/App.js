import './App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginForm } from './components/account/Login';
import { SignupForm } from './components/account/Signup';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { CreateEvent } from './components/CreateEvent';
import { EventCalendar } from './components/EventCalendar';
import { BookAppointment } from './components/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

function App() {
  // TODO: Figure out what styling is smooshing the navbar
  const { authReady } = useAuth();
  if (!authReady) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />{' '}
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
        </header>
      </div>
    );
  }
}

export default App;
