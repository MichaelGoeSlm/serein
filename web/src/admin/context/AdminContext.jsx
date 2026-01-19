import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

const ADMIN_EMAILS = ['michaelparis23@gmail.com'];

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing admin session
    const storedAdmin = localStorage.getItem('serein_admin');
    if (storedAdmin) {
      try {
        const { email, expiry } = JSON.parse(storedAdmin);
        if (expiry > Date.now() && ADMIN_EMAILS.includes(email)) {
          setIsAdminLoggedIn(true);
          setAdminEmail(email);
        } else {
          localStorage.removeItem('serein_admin');
        }
      } catch {
        localStorage.removeItem('serein_admin');
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = (email, password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!ADMIN_EMAILS.includes(email)) {
      return { success: false, error: 'Email non autorisé' };
    }

    if (password !== adminPassword) {
      return { success: false, error: 'Mot de passe incorrect' };
    }

    // Store session for 24 hours
    const sessionData = {
      email,
      expiry: Date.now() + 24 * 60 * 60 * 1000
    };
    localStorage.setItem('serein_admin', JSON.stringify(sessionData));

    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    return { success: true };
  };

  const adminLogout = () => {
    localStorage.removeItem('serein_admin');
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
  };

  const value = {
    isAdminLoggedIn,
    adminEmail,
    loading,
    adminLogin,
    adminLogout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
