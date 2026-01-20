import { useState, useRef, useEffect } from 'react';
import { Settings, Moon, Sun, Type, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import './AccessibilitySettings.css';

function AccessibilitySettings() {
  const { darkMode, toggleDarkMode, largeText, toggleLargeText } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="accessibility-container" ref={menuRef}>
      <button
        className="accessibility-trigger icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('accessibility.settings')}
        aria-expanded={isOpen}
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="accessibility-menu">
          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label={t('accessibility.close')}
          >
            <X size={20} />
            <span className="close-text">{t('accessibility.close')}</span>
          </button>

          <div className="accessibility-header">
            {t('accessibility.settings')}
          </div>

          <div className="accessibility-option">
            <div className="option-info">
              {darkMode ? <Sun size={20} className="option-icon" /> : <Moon size={20} className="option-icon" />}
              <span className="option-label">{t('accessibility.darkMode')}</span>
            </div>
            <button
              className={`toggle-btn ${darkMode ? 'active' : ''}`}
              onClick={toggleDarkMode}
              aria-pressed={darkMode}
            >
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {darkMode ? t('accessibility.on') : t('accessibility.off')}
              </span>
            </button>
          </div>

          <div className="accessibility-option">
            <div className="option-info">
              <Type size={20} className="option-icon" />
              <span className="option-label">{t('accessibility.largeText')}</span>
            </div>
            <button
              className={`toggle-btn ${largeText ? 'active' : ''}`}
              onClick={toggleLargeText}
              aria-pressed={largeText}
            >
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {largeText ? t('accessibility.on') : t('accessibility.off')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilitySettings;
