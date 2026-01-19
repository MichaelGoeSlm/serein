import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

function AdminProtectedRoute({ children }) {
  const { isAdminLoggedIn, loading } = useAdmin();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
