import './App.css';
import { Route, Routes } from 'react-router-dom';
// import { Account } from './components/account/Account';
import { LoginForm } from './components/account/Login';
import { SignupForm } from './components/account/Signup';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { CreateEvent } from './components/CreateEvent';
import { EventCalendar } from './components/EventCalendar';
// import Error from './components/Error';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>} exact />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/signup" element={<SignupForm/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/create_event" element={<CreateEvent/>} />
          <Route path="/event_cal" element={<EventCalendar/>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
