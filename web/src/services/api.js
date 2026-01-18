import axios from 'axios';

// Use environment variable for production, fallback to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function analyzeUrl(url) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/analyze`, { url }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 seconds timeout for analysis
    });

    return response.data;
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'Une erreur est survenue lors de l\'analyse';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } else {
      // Error setting up request
      throw new Error('Erreur lors de la préparation de la requête.');
    }
  }
}
