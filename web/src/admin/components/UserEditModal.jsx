import { useState } from 'react';
import { updateUserSubscription } from '../services/adminFirestore';
import '../admin.css';

// Helper function to parse date from various formats
function parseDate(dateValue) {
  if (!dateValue) return '';

  try {
    let date;

    // Firestore Timestamp with toDate() method
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    }
    // Serialized Firestore Timestamp from API (has _seconds)
    else if (dateValue._seconds) {
      date = new Date(dateValue._seconds * 1000);
    }
    // ISO string or other date string
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    // Already a Date object
    else if (dateValue instanceof Date) {
      date = dateValue;
    }
    // Object with seconds (another format)
    else if (dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000);
    }
    else {
      return '';
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error parsing date:', error);
    return '';
  }
}

function UserEditModal({ user, onClose, onSave }) {
  const [status, setStatus] = useState(user?.subscription?.status || 'free');
  const [endDate, setEndDate] = useState(() => parseDate(user?.subscription?.endDate));
  const [resetAnalyses, setResetAnalyses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updateData = {
        status
      };

      if (status === 'active' && endDate) {
        updateData.endDate = new Date(endDate);
        if (!user?.subscription?.startDate) {
          updateData.startDate = new Date();
        }
      }

      if (status === 'free') {
        updateData.endDate = null;
        updateData.startDate = null;
      }

      if (resetAnalyses) {
        updateData.analysesUsed = 0;
      }

      await updateUserSubscription(user.id, updateData);
      onSave();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>Modifier l'utilisateur</h3>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-content">
          {error && <div className="admin-error">{error}</div>}

          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div>
              <strong>{user?.name || 'Sans nom'}</strong>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="status">Statut de l'abonnement</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="free">Free</option>
              <option value="active">Premium (Active)</option>
            </select>
          </div>

          {status === 'active' && (
            <div className="admin-form-group">
              <label htmlFor="endDate">Date de fin Premium</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          <div className="admin-form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={resetAnalyses}
                onChange={(e) => setResetAnalyses(e.target.checked)}
              />
              Remettre le compteur d'analyses à 0
            </label>
            <small>Actuellement : {user?.subscription?.analysesUsed || 0} analyses</small>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="admin-btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="admin-btn-save"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEditModal;
