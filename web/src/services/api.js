import axios from 'axios';

const API_URL = "https://serein-backend.onrender.com";

export async function analyzeUrl(url) {
  try {
    const response = await axios.post(`${API_URL}/api/analyze`, { url }, {
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

export async function analyzeImages(imagesBase64Array) {
  try {
    const response = await axios.post(`${API_URL}/api/analyze/image`, { images: imagesBase64Array }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 120000 // 120 seconds timeout for multiple image analysis
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.error || 'Une erreur est survenue lors de l\'analyse des images';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } else {
      throw new Error('Erreur lors de la préparation de la requête.');
    }
  }
}

export async function analyzeText(text) {
  try {
    const response = await axios.post(`${API_URL}/api/analyze/text`, { text }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 120000 // 120 seconds timeout for text analysis with web search
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.error || 'Une erreur est survenue lors de l\'analyse du texte';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } else {
      throw new Error('Erreur lors de la préparation de la requête.');
    }
  }
}
