import { useLanguage } from '../i18n/LanguageContext';
import './LanguageSelector.css';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' }
];

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-button ${language === lang.code ? 'active' : ''}`}
          onClick={() => changeLanguage(lang.code)}
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
