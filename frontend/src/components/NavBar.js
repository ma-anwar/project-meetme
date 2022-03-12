import './NavBar.css';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export function NavBar() {
     
  return (
    <div className="NavBarItems">
        <Typography variant="h2" className="navbar-logo"><Link className="Link_home" to="/">MeetMe</Link></Typography><CalendarMonthIcon className="calIcon"/>
        <ul className="nav-menu">
            <li>
              <Link className="Link_nav-links" to="/login">Login</Link>
            </li>
            <li>
              <Link className="Link_nav-links" to="/signup">Signup</Link>
            </li>
            <li>
              <Link className="Link_nav-links" to="/profile">Profile</Link>
            </li>
        </ul>
    </div>
  );
}