const API_URL = import.meta.env.VITE_API_URL || 'https://serein-backend.onrender.com';

/**
 * Get admin credentials from localStorage
 */
function getAdminCredentials() {
  const email = localStorage.getItem('serein_admin_email');
  const password = localStorage.getItem('serein_admin_password');
  return { email, password };
}

/**
 * Make an authenticated admin API request
 */
async function adminFetch(endpoint, options = {}) {
  const { email, password } = getAdminCredentials();

  if (!email || !password) {
    throw new Error('Admin credentials not found');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Email': email,
      'X-Admin-Password': password,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Get all users from API
 */
export async function getAllUsers() {
  const data = await adminFetch('/api/admin/users');
  return data.users || [];
}

/**
 * Get admin statistics from API
 */
export async function getAdminStats() {
  return adminFetch('/api/admin/stats');
}

/**
 * Update user subscription via API
 */
export async function updateUserSubscription(userId, subscriptionData) {
  await adminFetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ subscription: subscriptionData })
  });
  return true;
}
