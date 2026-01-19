const errorMessages = {
  fr: {
    invalidUrl: "URL invalide. Veuillez fournir une URL valide.",
    fetchFailed: "Impossible de récupérer le contenu de la page.",
    analysisFailed: "Échec de l'analyse. Veuillez réessayer.",
    noContent: "Aucun contenu à analyser sur cette page.",
    apiKeyMissing: "Clé API Anthropic non configurée. Contactez l'administrateur.",
    noImages: "Aucune image fournie.",
    tooManyImages: "Maximum 5 images autorisées.",
    noText: "Aucun texte fourni.",
    textTooLong: "Le texte est trop long. Maximum 10 000 caractères.",
    rateLimited: "Trop de requêtes. Veuillez patienter quelques instants."
  },
  en: {
    invalidUrl: "Invalid URL. Please provide a valid URL.",
    fetchFailed: "Unable to fetch page content.",
    analysisFailed: "Analysis failed. Please try again.",
    noContent: "No content to analyze on this page.",
    apiKeyMissing: "Anthropic API key not configured. Contact administrator.",
    noImages: "No images provided.",
    tooManyImages: "Maximum 5 images allowed.",
    noText: "No text provided.",
    textTooLong: "Text is too long. Maximum 10,000 characters.",
    rateLimited: "Too many requests. Please wait a moment."
  },
  es: {
    invalidUrl: "URL inválida. Por favor, proporciona una URL válida.",
    fetchFailed: "No se pudo obtener el contenido de la página.",
    analysisFailed: "Error en el análisis. Por favor, inténtalo de nuevo.",
    noContent: "No hay contenido para analizar en esta página.",
    apiKeyMissing: "Clave API de Anthropic no configurada. Contacta al administrador.",
    noImages: "No se proporcionaron imágenes.",
    tooManyImages: "Máximo 5 imágenes permitidas.",
    noText: "No se proporcionó texto.",
    textTooLong: "El texto es demasiado largo. Máximo 10.000 caracteres.",
    rateLimited: "Demasiadas solicitudes. Por favor, espera un momento."
  }
};

function getError(key, lang = 'fr') {
  const validLang = ['fr', 'en', 'es'].includes(lang) ? lang : 'fr';
  return errorMessages[validLang][key] || errorMessages['fr'][key] || key;
}

module.exports = { errorMessages, getError };
