import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();

// Detect browser language
const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();

  // Return the language if supported, otherwise default to French
  if (['fr', 'en', 'es'].includes(langCode)) {
    return langCode;
  }
  return 'fr';
};

// Get stored language or detect from browser
const getInitialLanguage = () => {
  const stored = localStorage.getItem('serein-language');
  if (stored && ['fr', 'en', 'es'].includes(stored)) {
    return stored;
  }
  return detectBrowserLanguage();
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('serein-language', language);
  }, [language]);

  // Translation function
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to French if key not found
        value = translations['fr'];
        for (const fk of keys) {
          if (value && typeof value === 'object' && fk in value) {
            value = value[fk];
          } else {
            return key; // Return key if not found anywhere
          }
        }
        break;
      }
    }

    return value || key;
  };

  const changeLanguage = (lang) => {
    if (['fr', 'en', 'es'].includes(lang)) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
