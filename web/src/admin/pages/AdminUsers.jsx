import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { getAllUsers } from '../services/adminFirestore';
import UserEditModal from '../components/UserEditModal';
import '../admin.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, premium, free
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const { adminEmail, adminLogout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  // Helper to parse dates from various formats (API returns _seconds format)
  const parseDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        return dateValue.toDate();
      }
      if (dateValue._seconds) {
        return new Date(dateValue._seconds * 1000);
      }
      if (dateValue.seconds) {
        return new Date(dateValue.seconds * 1000);
      }
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        return new Date(dateValue);
      }
      return null;
    } catch {
      return null;
    }
  };

  const getSubscriptionStatus = (user) => {
    const subscription = user.subscription || {};
    if (subscription.status === 'active') {
      const endDate = parseDate(subscription.endDate);
      if (endDate) {
        if (endDate > new Date()) {
          return 'premium';
        }
      } else {
        return 'premium';
      }
    }
    return 'free';
  };

  const formatDate = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date || isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter by subscription status
      if (filter !== 'all') {
        const status = getSubscriptionStatus(user);
        if (filter !== status) return false;
      }

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        const name = (user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        if (!name.includes(searchLower) && !email.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [users, filter, search]);

  const handleEditSave = () => {
    setEditingUser(null);
    loadUsers(); // Reload users to show updated data
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
        <Link to="/admin/dashboard" className="admin-nav-link">
          Dashboard
        </Link>
        <Link to="/admin/users" className="admin-nav-link active">
          Utilisateurs
        </Link>
      </nav>

      <main className="admin-main">
        <h2>Utilisateurs ({filteredUsers.length})</h2>

        {/* Filters and Search */}
        <div className="admin-toolbar">
          <div className="admin-filters">
            <button
              className={`admin-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous ({users.length})
            </button>
            <button
              className={`admin-filter-btn ${filter === 'premium' ? 'active' : ''}`}
              onClick={() => setFilter('premium')}
            >
              Premium ({users.filter(u => getSubscriptionStatus(u) === 'premium').length})
            </button>
            <button
              className={`admin-filter-btn ${filter === 'free' ? 'active' : ''}`}
              onClick={() => setFilter('free')}
            >
              Free ({users.filter(u => getSubscriptionStatus(u) === 'free').length})
            </button>
          </div>

          <div className="admin-search">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="admin-loading">
            <div className="admin-loading-spinner"></div>
            <p>Chargement des utilisateurs...</p>
          </div>
        )}

        {error && (
          <div className="admin-error-box">
            {error}
            <button onClick={loadUsers}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Inscription</th>
                  <th>Statut</th>
                  <th>Fin Premium</th>
                  <th>Analyses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-table-empty">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const status = getSubscriptionStatus(user);
                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-table-avatar">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                            ) : (
                              <span>👤</span>
                            )}
                          </div>
                        </td>
                        <td>{user.name || '-'}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <span className={`admin-badge ${status}`}>
                            {status === 'premium' ? '⭐ Premium' : 'Free'}
                          </span>
                        </td>
                        <td>
                          {status === 'premium'
                            ? formatDate(user.subscription?.endDate)
                            : '-'}
                        </td>
                        <td>{user.subscription?.analysesUsed || 0}</td>
                        <td>
                          <button
                            className="admin-edit-btn"
                            onClick={() => setEditingUser(user)}
                          >
                            Modifier
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default AdminUsers;
