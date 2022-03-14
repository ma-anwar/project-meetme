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

function App() {
  // TODO: Render everything only if the app is not in the initial loading state
  // TODO: Figure out what styling is smooshing the navbar
  // TODO: Get rid of styling that is smooshing the components udner the navbar? We want login/signup components to be centered in the page
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

export default App;
