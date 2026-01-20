import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

const ADMIN_EMAILS = ['michaelparis23@gmail.com'];
const API_URL = import.meta.env.VITE_API_URL || 'https://serein-backend.onrender.com';

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
    const storedEmail = localStorage.getItem('serein_admin_email');
    const storedPassword = localStorage.getItem('serein_admin_password');
    const storedExpiry = localStorage.getItem('serein_admin_expiry');

    if (storedEmail && storedPassword && storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      if (expiry > Date.now() && ADMIN_EMAILS.includes(storedEmail)) {
        setIsAdminLoggedIn(true);
        setAdminEmail(storedEmail);
      } else {
        // Session expired, clear storage
        clearAdminStorage();
      }
    }
    setLoading(false);
  }, []);

  const clearAdminStorage = () => {
    localStorage.removeItem('serein_admin_email');
    localStorage.removeItem('serein_admin_password');
    localStorage.removeItem('serein_admin_expiry');
  };

  const adminLogin = async (email, password) => {
    // Check if email is in allowed list
    if (!ADMIN_EMAILS.includes(email)) {
      return { success: false, error: 'Email non autorisé' };
    }

    try {
      // Verify credentials with backend
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          'X-Admin-Email': email,
          'X-Admin-Password': password
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (response.status === 403) {
          return { success: false, error: 'Mot de passe incorrect' };
        }
        return { success: false, error: error.error || 'Erreur de connexion' };
      }

      // Store credentials for 24 hours
      const expiry = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('serein_admin_email', email);
      localStorage.setItem('serein_admin_password', password);
      localStorage.setItem('serein_admin_expiry', expiry.toString());

      setIsAdminLoggedIn(true);
      setAdminEmail(email);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const adminLogout = () => {
    clearAdminStorage();
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
