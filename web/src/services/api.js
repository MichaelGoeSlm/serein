import axios from 'axios';

const API_URL = "https://serein-backend.onrender.com";

export async function analyzeUrl(url, lang = 'fr') {
  try {
    const response = await axios.post(`${API_URL}/api/analyze`, { url, lang }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.error || 'Une erreur est survenue lors de l\'analyse';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } else {
      throw new Error('Erreur lors de la préparation de la requête.');
    }
  }
}

export async function analyzeImages(imagesBase64Array, lang = 'fr') {
  try {
    const response = await axios.post(`${API_URL}/api/analyze/image`, { images: imagesBase64Array, lang }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 120000
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

export async function analyzeText(text, lang = 'fr') {
  try {
    const response = await axios.post(`${API_URL}/api/analyze/text`, { text, lang }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 120000
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
