const translations = {
  fr: {
    // Header
    appName: "Serein",
    tagline: "Analysez vos liens, images et textes en toute sérénité",

    // Landing page
    landing: {
      heroTitle: "Protégez-vous des arnaques en ligne",
      heroSubtitle: "Une intelligence artificielle bienveillante qui analyse vos liens, emails et images pour détecter les contenus trompeurs.",
      cta: "Commencer gratuitement",
      howItWorks: "Comment ça marche",
      step1: "Collez un lien ou une image",
      step2: "Notre IA analyse le contenu",
      step3: "Recevez un verdict clair",
      whySerein: "Pourquoi Serein ?",
      benefit1: "Pas de publicité",
      benefit2: "Pas de tracking",
      benefit3: "Vos données restent privées",
      benefit4: "Conçu pour être simple",
      pricingTitle: "Un prix simple et transparent",
      pricingFree: "3 analyses gratuites pour essayer",
      pricingPaid: "Puis 29 € / an pour un accès illimité",
      pricingNote: "Pas d'engagement. Pas de surprise.",
      footer: "Fait avec ❤️ pour votre tranquillité"
    },

    // Login page
    login: {
      title: "Connexion",
      subtitle: "Connectez-vous pour commencer à analyser",
      googleButton: "Continuer avec Google",
      or: "ou",
      magicLinkInfo: "Connexion par Magic Link bientôt disponible",
      benefitsTitle: "En vous connectant, vous bénéficiez de :",
      benefit1: "3 analyses gratuites",
      benefit2: "Historique de vos analyses",
      benefit3: "Accès sur tous vos appareils"
    },

    // Onboarding
    onboarding: {
      step1Title: "Choisissez votre langue",
      step1Description: "Serein s'adapte à votre langue préférée.",
      step2Title: "Comment ça marche",
      step2Description: "Serein analyse vos contenus pour détecter les arnaques.",
      feature1Title: "Analysez des liens",
      feature1Description: "Collez l'URL d'un site ou d'un article suspect.",
      feature2Title: "Analysez des images",
      feature2Description: "Importez des captures d'écran de messages suspects.",
      feature3Title: "Analysez des textes",
      feature3Description: "Copiez-collez le contenu d'un email douteux.",
      step3Title: "Vous êtes prêt !",
      step3Description: "Commencez à utiliser Serein en toute sérénité.",
      freeAnalyses: "Vous avez 3 analyses gratuites",
      upgradeNote: "Passez à l'illimité pour 29€/an",
      back: "Retour",
      next: "Suivant",
      start: "Commencer"
    },

    // Tabs
    tabLink: "Lien",
    tabImage: "Image",
    tabText: "Texte",

    // Link input
    linkPlaceholder: "Collez votre lien ici (ex: https://exemple.com)",
    linkHint: "Collez l'URL d'une page web, d'un article ou d'un site suspect",
    analyzeLink: "Analyser ce lien",

    // Image input
    imageButton: "Cliquez pour sélectionner des images",
    imageDragHint: "ou glissez-déposez vos fichiers ici",
    imageFormats: "Formats acceptés : PNG, JPEG, GIF, WebP (max 5 Mo par image)",
    imageLimit: "images",
    addMore: "Ajouter",
    analyzeImage: "Analyser cette image",
    analyzeImages: "Analyser ces images",
    removeAll: "Tout supprimer",
    maxImagesAlert: "Maximum 5 images autorisées.",
    imageTooLarge: "est trop volumineuse. Maximum 5 Mo par image.",
    invalidImage: "n'est pas une image valide.",

    // Text input
    textPlaceholder: "Collez ici le texte d'un email ou d'un message suspect...",
    analyzeText: "Analyser ce texte",
    characters: "caractères",
    textTooLong: "Le texte est trop long. Veuillez le réduire à 10 000 caractères maximum.",

    // Loading
    analyzing: "Analyse...",
    analyzingInProgress: "Analyse en cours...",
    examiningContent: "Nous examinons le contenu de la page",
    examiningImage: "Nous examinons l'image",
    examiningImages: "Nous examinons les {count} images",
    examiningText: "Nous examinons le texte",

    // Results
    trustLevel: "Niveau de confiance",
    summary: "Résumé",
    redFlags: "Signaux d'alerte",
    reassurance: "Notre conseil",
    verdict: {
      fiable: "Fiable",
      prudence: "Prudence",
      suspect: "Suspect"
    },

    // Errors
    oops: "Oups !",
    errorServer: "Impossible de contacter le serveur. Vérifiez que le backend est démarré.",
    errorAnalysis: "Une erreur est survenue lors de l'analyse",
    errorRequest: "Erreur lors de la préparation de la requête.",

    // Footer
    poweredBy: "Propulsé par Claude AI",
    madeWith: "Fait avec",
    forYourPeace: "pour votre sérénité",

    // Help messages
    helpLinkFailed: "Ce lien ne peut pas être analysé. Essayez une capture d'écran à la place.",
    helpTryScreenshot: "Astuce : Une capture d'écran fonctionne souvent mieux qu'un lien.",
    helpCopyText: "Vous pouvez aussi copier-coller le texte directement.",
    helpUnderstood: "Compris",

    // History
    historyTitle: "Vos dernières analyses",
    historyEmpty: "Aucune analyse récente",
    historyClear: "Effacer l'historique",
    historyConfirmClear: "Voulez-vous vraiment effacer l'historique ?",
    historyYes: "Oui, effacer",
    historyNo: "Non, annuler",

    // Progress
    progressFetching: "Récupération du contenu...",
    progressAnalyzing: "Analyse en cours...",
    progressSearching: "Vérification en ligne...",
    progressAlmostDone: "Presque terminé...",
    pleaseWait: "Veuillez patienter",
    analysisTime: "L'analyse prend généralement 10-20 secondes",

    // Instructions
    instructionLink: "Collez un lien et appuyez sur Analyser",
    instructionImage: "Ajoutez une ou plusieurs images",
    instructionText: "Collez le texte suspect ici",

    // Actions
    newAnalysis: "Nouvelle analyse",
    viewDetails: "Voir les détails"
  },

  en: {
    // Header
    appName: "Serein",
    tagline: "Analyze your links, images, and texts with peace of mind",

    // Landing page
    landing: {
      heroTitle: "Protect yourself from online scams",
      heroSubtitle: "A friendly AI that analyzes your links, emails, and images to detect misleading content.",
      cta: "Start for free",
      howItWorks: "How it works",
      step1: "Paste a link or image",
      step2: "Our AI analyzes the content",
      step3: "Get a clear verdict",
      whySerein: "Why Serein?",
      benefit1: "No ads",
      benefit2: "No tracking",
      benefit3: "Your data stays private",
      benefit4: "Designed to be simple",
      pricingTitle: "Simple and transparent pricing",
      pricingFree: "3 free analyses to try",
      pricingPaid: "Then 29 EUR/year for unlimited access",
      pricingNote: "No commitment. No surprises.",
      footer: "Made with ❤️ for your peace of mind"
    },

    // Login page
    login: {
      title: "Sign in",
      subtitle: "Sign in to start analyzing",
      googleButton: "Continue with Google",
      or: "or",
      magicLinkInfo: "Magic Link sign-in coming soon",
      benefitsTitle: "By signing in, you get:",
      benefit1: "3 free analyses",
      benefit2: "Your analysis history",
      benefit3: "Access on all your devices"
    },

    // Onboarding
    onboarding: {
      step1Title: "Choose your language",
      step1Description: "Serein adapts to your preferred language.",
      step2Title: "How it works",
      step2Description: "Serein analyzes your content to detect scams.",
      feature1Title: "Analyze links",
      feature1Description: "Paste the URL of a suspicious site or article.",
      feature2Title: "Analyze images",
      feature2Description: "Upload screenshots of suspicious messages.",
      feature3Title: "Analyze texts",
      feature3Description: "Copy and paste the content of a suspicious email.",
      step3Title: "You're ready!",
      step3Description: "Start using Serein with peace of mind.",
      freeAnalyses: "You have 3 free analyses",
      upgradeNote: "Upgrade to unlimited for 29 EUR/year",
      back: "Back",
      next: "Next",
      start: "Get started"
    },

    // Tabs
    tabLink: "Link",
    tabImage: "Image",
    tabText: "Text",

    // Link input
    linkPlaceholder: "Paste your link here (e.g., https://example.com)",
    linkHint: "Paste the URL of a web page, article, or suspicious site",
    analyzeLink: "Analyze this link",

    // Image input
    imageButton: "Click to select images",
    imageDragHint: "or drag and drop your files here",
    imageFormats: "Accepted formats: PNG, JPEG, GIF, WebP (max 5 MB per image)",
    imageLimit: "images",
    addMore: "Add",
    analyzeImage: "Analyze this image",
    analyzeImages: "Analyze these images",
    removeAll: "Remove all",
    maxImagesAlert: "Maximum 5 images allowed.",
    imageTooLarge: "is too large. Maximum 5 MB per image.",
    invalidImage: "is not a valid image.",

    // Text input
    textPlaceholder: "Paste here the text from a suspicious email or message...",
    analyzeText: "Analyze this text",
    characters: "characters",
    textTooLong: "The text is too long. Please reduce it to 10,000 characters maximum.",

    // Loading
    analyzing: "Analyzing...",
    analyzingInProgress: "Analysis in progress...",
    examiningContent: "We are examining the page content",
    examiningImage: "We are examining the image",
    examiningImages: "We are examining the {count} images",
    examiningText: "We are examining the text",

    // Results
    trustLevel: "Trust level",
    summary: "Summary",
    redFlags: "Red flags",
    reassurance: "Our advice",
    verdict: {
      fiable: "Reliable",
      prudence: "Caution",
      suspect: "Suspect"
    },

    // Errors
    oops: "Oops!",
    errorServer: "Unable to contact the server. Make sure the backend is running.",
    errorAnalysis: "An error occurred during analysis",
    errorRequest: "Error preparing the request.",

    // Footer
    poweredBy: "Powered by Claude AI",
    madeWith: "Made with",
    forYourPeace: "for your peace of mind",

    // Help messages
    helpLinkFailed: "This link cannot be analyzed. Try a screenshot instead.",
    helpTryScreenshot: "Tip: A screenshot often works better than a link.",
    helpCopyText: "You can also copy and paste the text directly.",
    helpUnderstood: "Got it",

    // History
    historyTitle: "Your recent analyses",
    historyEmpty: "No recent analyses",
    historyClear: "Clear history",
    historyConfirmClear: "Are you sure you want to clear the history?",
    historyYes: "Yes, clear",
    historyNo: "No, cancel",

    // Progress
    progressFetching: "Fetching content...",
    progressAnalyzing: "Analyzing...",
    progressSearching: "Checking online...",
    progressAlmostDone: "Almost done...",
    pleaseWait: "Please wait",
    analysisTime: "Analysis usually takes 10-20 seconds",

    // Instructions
    instructionLink: "Paste a link and press Analyze",
    instructionImage: "Add one or more images",
    instructionText: "Paste the suspicious text here",

    // Actions
    newAnalysis: "New analysis",
    viewDetails: "View details"
  },

  es: {
    // Header
    appName: "Serein",
    tagline: "Analiza tus enlaces, imágenes y textos con tranquilidad",

    // Landing page
    landing: {
      heroTitle: "Protégete de las estafas en línea",
      heroSubtitle: "Una inteligencia artificial amigable que analiza tus enlaces, correos e imágenes para detectar contenido engañoso.",
      cta: "Empezar gratis",
      howItWorks: "Cómo funciona",
      step1: "Pega un enlace o imagen",
      step2: "Nuestra IA analiza el contenido",
      step3: "Recibe un veredicto claro",
      whySerein: "¿Por qué Serein?",
      benefit1: "Sin publicidad",
      benefit2: "Sin rastreo",
      benefit3: "Tus datos permanecen privados",
      benefit4: "Diseñado para ser simple",
      pricingTitle: "Precio simple y transparente",
      pricingFree: "3 análisis gratis para probar",
      pricingPaid: "Luego 29 EUR / año para acceso ilimitado",
      pricingNote: "Sin compromiso. Sin sorpresas.",
      footer: "Hecho con ❤️ para tu tranquilidad"
    },

    // Login page
    login: {
      title: "Iniciar sesión",
      subtitle: "Inicia sesión para empezar a analizar",
      googleButton: "Continuar con Google",
      or: "o",
      magicLinkInfo: "Inicio de sesión con Magic Link próximamente",
      benefitsTitle: "Al iniciar sesión, obtienes:",
      benefit1: "3 análisis gratis",
      benefit2: "Tu historial de análisis",
      benefit3: "Acceso en todos tus dispositivos"
    },

    // Onboarding
    onboarding: {
      step1Title: "Elige tu idioma",
      step1Description: "Serein se adapta a tu idioma preferido.",
      step2Title: "Cómo funciona",
      step2Description: "Serein analiza tus contenidos para detectar estafas.",
      feature1Title: "Analiza enlaces",
      feature1Description: "Pega la URL de un sitio o artículo sospechoso.",
      feature2Title: "Analiza imágenes",
      feature2Description: "Sube capturas de pantalla de mensajes sospechosos.",
      feature3Title: "Analiza textos",
      feature3Description: "Copia y pega el contenido de un email sospechoso.",
      step3Title: "¡Estás listo!",
      step3Description: "Empieza a usar Serein con tranquilidad.",
      freeAnalyses: "Tienes 3 análisis gratis",
      upgradeNote: "Pasa a ilimitado por 29 EUR/año",
      back: "Atrás",
      next: "Siguiente",
      start: "Empezar"
    },

    // Tabs
    tabLink: "Enlace",
    tabImage: "Imagen",
    tabText: "Texto",

    // Link input
    linkPlaceholder: "Pega tu enlace aquí (ej: https://ejemplo.com)",
    linkHint: "Pega la URL de una página web, artículo o sitio sospechoso",
    analyzeLink: "Analizar este enlace",

    // Image input
    imageButton: "Haz clic para seleccionar imágenes",
    imageDragHint: "o arrastra y suelta tus archivos aquí",
    imageFormats: "Formatos aceptados: PNG, JPEG, GIF, WebP (máx. 5 MB por imagen)",
    imageLimit: "imágenes",
    addMore: "Añadir",
    analyzeImage: "Analizar esta imagen",
    analyzeImages: "Analizar estas imágenes",
    removeAll: "Eliminar todo",
    maxImagesAlert: "Máximo 5 imágenes permitidas.",
    imageTooLarge: "es demasiado grande. Máximo 5 MB por imagen.",
    invalidImage: "no es una imagen válida.",

    // Text input
    textPlaceholder: "Pega aquí el texto de un email o mensaje sospechoso...",
    analyzeText: "Analizar este texto",
    characters: "caracteres",
    textTooLong: "El texto es demasiado largo. Por favor, redúcelo a 10.000 caracteres máximo.",

    // Loading
    analyzing: "Analizando...",
    analyzingInProgress: "Análisis en curso...",
    examiningContent: "Estamos examinando el contenido de la página",
    examiningImage: "Estamos examinando la imagen",
    examiningImages: "Estamos examinando las {count} imágenes",
    examiningText: "Estamos examinando el texto",

    // Results
    trustLevel: "Nivel de confianza",
    summary: "Resumen",
    redFlags: "Señales de alerta",
    reassurance: "Nuestro consejo",
    verdict: {
      fiable: "Fiable",
      prudence: "Precaución",
      suspect: "Sospechoso"
    },

    // Errors
    oops: "¡Ups!",
    errorServer: "No se puede contactar el servidor. Verifica que el backend esté ejecutándose.",
    errorAnalysis: "Ocurrió un error durante el análisis",
    errorRequest: "Error al preparar la solicitud.",

    // Footer
    poweredBy: "Desarrollado con Claude AI",
    madeWith: "Hecho con",
    forYourPeace: "para tu tranquilidad",

    // Help messages
    helpLinkFailed: "Este enlace no se puede analizar. Prueba con una captura de pantalla.",
    helpTryScreenshot: "Consejo: Una captura de pantalla suele funcionar mejor que un enlace.",
    helpCopyText: "También puedes copiar y pegar el texto directamente.",
    helpUnderstood: "Entendido",

    // History
    historyTitle: "Tus análisis recientes",
    historyEmpty: "Sin análisis recientes",
    historyClear: "Borrar historial",
    historyConfirmClear: "¿Estás seguro de que quieres borrar el historial?",
    historyYes: "Sí, borrar",
    historyNo: "No, cancelar",

    // Progress
    progressFetching: "Obteniendo contenido...",
    progressAnalyzing: "Analizando...",
    progressSearching: "Verificando en línea...",
    progressAlmostDone: "Casi listo...",
    pleaseWait: "Por favor espera",
    analysisTime: "El análisis suele tardar 10-20 segundos",

    // Instructions
    instructionLink: "Pega un enlace y presiona Analizar",
    instructionImage: "Añade una o más imágenes",
    instructionText: "Pega el texto sospechoso aquí",

    // Actions
    newAnalysis: "Nuevo análisis",
    viewDetails: "Ver detalles"
  }
};

export default translations;
