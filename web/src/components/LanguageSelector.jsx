import { useLanguage } from '../i18n/LanguageContext';
import './LanguageSelector.css';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' }
];

function LanguageSelector({ onLanguageChosen }) {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    // Mark that user has explicitly chosen a language
    localStorage.setItem('serein-language-chosen', 'true');
    // Call callback if provided (to hide selector on landing/login pages)
    if (onLanguageChosen) {
      onLanguageChosen(langCode);
    }
  };

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-button ${language === lang.code ? 'active' : ''}`}
          onClick={() => handleLanguageChange(lang.code)}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="lang-flag">{lang.flag}</span>
          <span className="lang-code">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
