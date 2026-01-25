import { Link } from 'react-router-dom';
import { Shield, User } from 'lucide-react';
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
        <Shield size={24} className="logo-icon" />
        <span className="logo-text">Serein</span>
      </Link>

      <div className="navbar-right">
        {/* Hide on mobile - settings are in Account page */}
        <div className="navbar-settings-desktop">
          <AccessibilitySettings />
        </div>

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
              <User size={20} />
            </div>
          )}
          <span className="navbar-account-text">{t('nav.myAccount')}</span>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
