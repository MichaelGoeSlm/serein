import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('serein_darkMode');
    return stored === 'true';
  });

  const [largeText, setLargeText] = useState(() => {
    const stored = localStorage.getItem('serein_largeText');
    return stored === 'true';
  });

  const [simpleMode, setSimpleMode] = useState(() => {
    const stored = localStorage.getItem('serein_simpleMode');
    return stored === 'true';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('serein_darkMode', darkMode.toString());
  }, [darkMode]);

  // Apply large text to document
  useEffect(() => {
    document.documentElement.setAttribute('data-largetext', largeText ? 'true' : 'false');
    localStorage.setItem('serein_largeText', largeText.toString());
  }, [largeText]);

  // Save simple mode to localStorage
  useEffect(() => {
    localStorage.setItem('serein_simpleMode', simpleMode.toString());
  }, [simpleMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleLargeText = () => setLargeText((prev) => !prev);
  const toggleSimpleMode = () => setSimpleMode((prev) => !prev);

  const value = {
    darkMode,
    setDarkMode,
    largeText,
    setLargeText,
    simpleMode,
    setSimpleMode,
    toggleDarkMode,
    toggleLargeText,
    toggleSimpleMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
