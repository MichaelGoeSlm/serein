import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import AccessibilitySettings from './AccessibilitySettings';
import './NavBar.css';

function NavBar() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="navbar">
      <Link to="/app" className="navbar-logo">
        <span className="logo-icon">🛡️</span>
        <span className="logo-text">Serein</span>
      </Link>

      <div className="navbar-right">
        <AccessibilitySettings />

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
          <span className="navbar-account-text">{t('nav.myAccount')}</span>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
