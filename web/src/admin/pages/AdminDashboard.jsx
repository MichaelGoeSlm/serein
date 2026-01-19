import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { getAdminStats } from '../services/adminFirestore';
import '../admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { adminEmail, adminLogout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Serein Admin</h1>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">{adminEmail}</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav-link active">
          Dashboard
        </Link>
        <Link to="/admin/users" className="admin-nav-link">
          Utilisateurs
        </Link>
      </nav>

      <main className="admin-main">
        <h2>Tableau de bord</h2>

        {loading && (
          <div className="admin-loading">
            <div className="admin-loading-spinner"></div>
            <p>Chargement des statistiques...</p>
          </div>
        )}

        {error && (
          <div className="admin-error-box">
            {error}
            <button onClick={loadStats}>Réessayer</button>
          </div>
        )}

        {stats && !loading && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">👥</div>
              <div className="admin-stat-value">{stats.totalUsers}</div>
              <div className="admin-stat-label">Utilisateurs total</div>
            </div>

            <div className="admin-stat-card premium">
              <div className="admin-stat-icon">⭐</div>
              <div className="admin-stat-value">{stats.premiumUsers}</div>
              <div className="admin-stat-label">Utilisateurs Premium</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">🆓</div>
              <div className="admin-stat-value">{stats.freeUsers}</div>
              <div className="admin-stat-label">Utilisateurs Free</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">🔍</div>
              <div className="admin-stat-value">{stats.totalAnalyses}</div>
              <div className="admin-stat-label">Analyses effectuées</div>
            </div>
          </div>
        )}

        <div className="admin-actions">
          <Link to="/admin/users" className="admin-action-btn">
            Voir tous les utilisateurs →
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
