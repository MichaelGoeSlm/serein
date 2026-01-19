import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

function NavBar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/app" className="navbar-logo">
        <span className="logo-icon">🛡️</span>
        <span className="logo-text">Serein</span>
      </Link>

      <Link to="/account" className="navbar-account">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="navbar-avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="navbar-avatar-placeholder">
            <span>👤</span>
          </div>
        )}
      </Link>
    </nav>
  );
}

export default NavBar;
