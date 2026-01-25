const translations = {
  fr: {
    // Header
    appName: "Serein",
    tagline: "Analysez vos liens, images et textes en toute sérénité",

    // Navigation
    nav: {
      myAccount: "Mon compte",
      verifyContent: "Vérifier un contenu"
    },

    // History details
    history: {
      viewDetails: "Détails de l'analyse",
      analysisDate: "Date de l'analyse",
      contentType: "Type de contenu",
      analyzedContent: "Contenu analysé",
      closeDetails: "Fermer"
    },

    // Email instructions
    email: {
      tabName: "Email",
      modalTitle: "Comment analyser un email suspect ?",
      step1Title: "Capture d'écran du haut de l'email",
      step1Text: "Ouvrez l'email suspect et cliquez sur les détails de l'expéditeur pour voir l'adresse email complète. Faites une capture d'écran montrant : le nom de l'expéditeur, l'adresse email, la date et l'objet.",
      step2Title: "Capture d'écran du corps du mail",
      step2Text: "Faites une seconde capture d'écran du contenu de l'email. Incluez les liens et boutons visibles.",
      important: "Important",
      importantText: "Les DEUX captures sont nécessaires pour une analyse complète. L'adresse de l'expéditeur nous permet de vérifier si l'email est légitime.",
      understoodButton: "J'ai compris, analyser mes images",
      cancelButton: "Annuler",
      // Animation demo
      demoSenderName: "Banque Secure",
      demoSubject: "⚠️ Urgent: Vérifiez votre compte",
      demoDate: "Aujourd'hui, 14:32",
      demoCapture: "Capturez ici !",
      animStep1: "👆 Appuyez sur l'expéditeur",
      animStep2: "✨ Les détails s'affichent",
      animStep3: "📸 Faites une capture d'écran"
    },

    // Accessibility
    accessibility: {
      settings: "Accessibilité",
      darkMode: "Mode nuit",
      largeText: "Gros caractères",
      simpleMode: "Mode simplifié",
      on: "Activé",
      off: "Désactivé",
      close: "Fermer réglages"
    },

    // Simple mode
    simpleMode: {
      title: "Que souhaitez-vous vérifier ?",
      photo: "Une photo",
      email: "Un email",
      showEmailInstructions: "Voir les instructions pour analyser un email",
      emailInstructionsTitle: "Comment analyser un email suspect ?",
      step1Title: "Faites une capture du haut de l'email",
      step1Text: "Ouvrez l'email, cliquez sur les détails de l'expéditeur, et capturez : nom, adresse email, date et objet.",
      step2Title: "Faites une capture du corps de l'email",
      step2Text: "Capturez le contenu du message avec les liens et boutons visibles.",
      warning: "Les 2 captures sont nécessaires pour une analyse complète !",
      sendScreenshots: "Envoyer mes captures d'écran",
      choosePhotos: "Choisir mes photos",
      selectPhotos: "Sélectionnez une ou plusieurs photos à analyser",
      photoDescription: "Capture d'écran de tout texte ou photo dont vous souhaitez vérifier la légitimité",
      analyze: "Analyser"
    },

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
      title: "Connectez-vous a Serein",
      googleButton: "Continuer avec Google",
      securityNote: "Connexion securisee. Nous n'accedons jamais a vos emails.",
      backToHome: "Retour a l'accueil",
      loading: "Connexion...",
      error: "Une erreur est survenue. Veuillez reessayer.",
      or: "OU",
      magicLinkTitle: "Connexion par email",
      magicLinkPlaceholder: "Votre adresse email",
      magicLinkButton: "Recevoir un lien de connexion",
      magicLinkSent: "Un lien de connexion a ete envoye a votre adresse email. Verifiez votre boite de reception.",
      magicLinkError: "Erreur lors de l'envoi du lien",
      verifying: "Verification en cours...",
      verifyError: "Lien invalide ou expire"
    },

    // Onboarding
    onboarding: {
      step1Title: "Serein analyse vos contenus",
      step1Text: "Collez un lien, une image ou un texte suspect. Notre IA verifie s'il s'agit d'une arnaque ou d'un contenu trompeur.",

      step2Title: "Votre vie privee est protegee",
      step2List1: "Pas de publicite",
      step2List2: "Pas de revente de donnees",
      step2List3: "Pas de jugement",
      step2Text: "Serein est la pour vous aider, pas pour vous surveiller.",

      step3Title: "C'est tres simple",
      step3Item1: "Copiez un lien suspect ou prenez une capture d'ecran",
      step3Item2: "Collez-le dans Serein",
      step3Item3: "Lisez le verdict en quelques secondes",

      next: "Suivant",
      start: "Commencer a utiliser Serein"
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
    viewDetails: "Voir les détails",

    // Analyses remaining
    analysesRemaining: "{count} analyses gratuites restantes",
    analysesRemainingOne: "1 analyse gratuite restante",

    // Account page
    account: {
      title: "Mon compte",
      profile: "Profil",
      subscription: "Abonnement",
      freePlan: "Plan gratuit",
      premiumPlan: "Plan Premium",
      analysesUsed: "{count} analyses utilisées",
      analysesRemaining: "{count} analyses gratuites restantes",
      validUntil: "Valide jusqu'au",
      upgradeToPremium: "Passer à Premium",
      history: "Historique des analyses",
      noHistory: "Aucune analyse pour le moment",
      logout: "Se déconnecter",
      language: "Langue"
    },

    // Paywall
    paywall: {
      title: "Vos analyses gratuites sont epuisees",
      subtitle: "Passez a Premium pour continuer a proteger vos proches",
      price: "29 EUR",
      period: "/ an",
      payWith: "Payer avec Lightning",
      later: "Plus tard"
    },

    // Payment
    payment: {
      title: "Paiement Premium",
      subtitle: "Accedez a des analyses illimitees",
      loading: "Chargement...",
      error: "Erreur lors de la creation de la facture",
      retry: "Reessayer",
      scanQR: "Scannez ce QR code avec votre wallet Bitcoin",
      orCopy: "Ou copiez la facture",
      copy: "Copier",
      copied: "Copie !",
      waiting: "En attente du paiement...",
      success: "Paiement recu !",
      expired: "Facture expiree",
      redirecting: "Redirection...",
      whyBitcoin: "Pourquoi Bitcoin ?",
      reason1: "Paiement securise et anonyme",
      reason2: "Transaction instantanee",
      reason3: "Pas de frais caches",
      back: "Retour"
    }
  },

  en: {
    // Header
    appName: "Serein",
    tagline: "Analyze your links, images, and texts with peace of mind",

    // Navigation
    nav: {
      myAccount: "My account",
      verifyContent: "Verify content"
    },

    // History details
    history: {
      viewDetails: "Analysis details",
      analysisDate: "Analysis date",
      contentType: "Content type",
      analyzedContent: "Analyzed content",
      closeDetails: "Close"
    },

    // Email instructions
    email: {
      tabName: "Email",
      modalTitle: "How to analyze a suspicious email?",
      step1Title: "Screenshot of the email header",
      step1Text: "Open the suspicious email and click on the sender details to see the full email address. Take a screenshot showing: the sender's name, email address, date and subject.",
      step2Title: "Screenshot of the email body",
      step2Text: "Take a second screenshot of the email content. Include visible links and buttons.",
      important: "Important",
      importantText: "BOTH screenshots are needed for a complete analysis. The sender's address allows us to verify if the email is legitimate.",
      understoodButton: "Got it, analyze my images",
      cancelButton: "Cancel",
      // Animation demo
      demoSenderName: "Secure Bank",
      demoSubject: "⚠️ Urgent: Verify your account",
      demoDate: "Today, 2:32 PM",
      demoCapture: "Capture here!",
      animStep1: "👆 Tap on the sender",
      animStep2: "✨ Details appear",
      animStep3: "📸 Take a screenshot"
    },

    // Accessibility
    accessibility: {
      settings: "Accessibility",
      darkMode: "Dark mode",
      largeText: "Large text",
      simpleMode: "Simple mode",
      on: "On",
      off: "Off",
      close: "Close settings"
    },

    // Simple mode
    simpleMode: {
      title: "What would you like to verify?",
      photo: "A photo",
      email: "An email",
      showEmailInstructions: "Show instructions for analyzing an email",
      emailInstructionsTitle: "How to analyze a suspicious email?",
      step1Title: "Take a screenshot of the email header",
      step1Text: "Open the email, click on sender details, and capture: name, email address, date and subject.",
      step2Title: "Take a screenshot of the email body",
      step2Text: "Capture the message content with visible links and buttons.",
      warning: "Both screenshots are needed for a complete analysis!",
      sendScreenshots: "Send my screenshots",
      choosePhotos: "Choose my photos",
      selectPhotos: "Select one or more photos to analyze",
      photoDescription: "Screenshot of any text or photo you want to verify the legitimacy of",
      analyze: "Analyze"
    },

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
      title: "Sign in to Serein",
      googleButton: "Continue with Google",
      securityNote: "Secure login. We never access your emails.",
      backToHome: "Back to home",
      loading: "Signing in...",
      error: "An error occurred. Please try again.",
      or: "OR",
      magicLinkTitle: "Login by email",
      magicLinkPlaceholder: "Your email address",
      magicLinkButton: "Receive a login link",
      magicLinkSent: "A login link has been sent to your email address. Check your inbox.",
      magicLinkError: "Error sending link",
      verifying: "Verifying...",
      verifyError: "Invalid or expired link"
    },

    // Onboarding
    onboarding: {
      step1Title: "Serein analyzes your content",
      step1Text: "Paste a suspicious link, image, or text. Our AI checks if it's a scam or misleading content.",

      step2Title: "Your privacy is protected",
      step2List1: "No ads",
      step2List2: "No data resale",
      step2List3: "No judgment",
      step2Text: "Serein is here to help you, not to monitor you.",

      step3Title: "It's very simple",
      step3Item1: "Copy a suspicious link or take a screenshot",
      step3Item2: "Paste it into Serein",
      step3Item3: "Read the verdict in seconds",

      next: "Next",
      start: "Start using Serein"
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
    viewDetails: "View details",

    // Analyses remaining
    analysesRemaining: "{count} free analyses remaining",
    analysesRemainingOne: "1 free analysis remaining",

    // Account page
    account: {
      title: "My account",
      profile: "Profile",
      subscription: "Subscription",
      freePlan: "Free plan",
      premiumPlan: "Premium plan",
      analysesUsed: "{count} analyses used",
      analysesRemaining: "{count} free analyses remaining",
      validUntil: "Valid until",
      upgradeToPremium: "Upgrade to Premium",
      history: "Analysis history",
      noHistory: "No analyses yet",
      logout: "Log out",
      language: "Language"
    },

    // Paywall
    paywall: {
      title: "Your free analyses are exhausted",
      subtitle: "Upgrade to Premium to keep protecting your loved ones",
      price: "29 EUR",
      period: "/ year",
      payWith: "Pay with Lightning",
      later: "Later"
    },

    // Payment
    payment: {
      title: "Premium Payment",
      subtitle: "Get unlimited analyses",
      loading: "Loading...",
      error: "Error creating invoice",
      retry: "Retry",
      scanQR: "Scan this QR code with your Bitcoin wallet",
      orCopy: "Or copy the invoice",
      copy: "Copy",
      copied: "Copied!",
      waiting: "Waiting for payment...",
      success: "Payment received!",
      expired: "Invoice expired",
      redirecting: "Redirecting...",
      whyBitcoin: "Why Bitcoin?",
      reason1: "Secure and anonymous payment",
      reason2: "Instant transaction",
      reason3: "No hidden fees",
      back: "Back"
    }
  },

  es: {
    // Header
    appName: "Serein",
    tagline: "Analiza tus enlaces, imágenes y textos con tranquilidad",

    // Navigation
    nav: {
      myAccount: "Mi cuenta",
      verifyContent: "Verificar contenido"
    },

    // History details
    history: {
      viewDetails: "Detalles del análisis",
      analysisDate: "Fecha del análisis",
      contentType: "Tipo de contenido",
      analyzedContent: "Contenido analizado",
      closeDetails: "Cerrar"
    },

    // Email instructions
    email: {
      tabName: "Email",
      modalTitle: "¿Cómo analizar un email sospechoso?",
      step1Title: "Captura de pantalla del encabezado del email",
      step1Text: "Abre el email sospechoso y haz clic en los detalles del remitente para ver la dirección de email completa. Haz una captura de pantalla mostrando: el nombre del remitente, la dirección de email, la fecha y el asunto.",
      step2Title: "Captura de pantalla del cuerpo del email",
      step2Text: "Haz una segunda captura de pantalla del contenido del email. Incluye los enlaces y botones visibles.",
      important: "Importante",
      importantText: "Las DOS capturas son necesarias para un análisis completo. La dirección del remitente nos permite verificar si el email es legítimo.",
      understoodButton: "Entendido, analizar mis imágenes",
      cancelButton: "Cancelar",
      // Animation demo
      demoSenderName: "Banco Seguro",
      demoSubject: "⚠️ Urgente: Verifique su cuenta",
      demoDate: "Hoy, 14:32",
      demoCapture: "¡Capture aquí!",
      animStep1: "👆 Toque en el remitente",
      animStep2: "✨ Aparecen los detalles",
      animStep3: "📸 Haga una captura de pantalla"
    },

    // Accessibility
    accessibility: {
      settings: "Accesibilidad",
      darkMode: "Modo nocturno",
      largeText: "Texto grande",
      simpleMode: "Modo simplificado",
      on: "Activado",
      off: "Desactivado",
      close: "Cerrar ajustes"
    },

    // Simple mode
    simpleMode: {
      title: "¿Qué desea verificar?",
      photo: "Una foto",
      email: "Un email",
      showEmailInstructions: "Ver instrucciones para analizar un email",
      emailInstructionsTitle: "¿Cómo analizar un email sospechoso?",
      step1Title: "Haga una captura del encabezado del email",
      step1Text: "Abra el email, haga clic en los detalles del remitente y capture: nombre, dirección de email, fecha y asunto.",
      step2Title: "Haga una captura del cuerpo del email",
      step2Text: "Capture el contenido del mensaje con los enlaces y botones visibles.",
      warning: "¡Las 2 capturas son necesarias para un análisis completo!",
      sendScreenshots: "Enviar mis capturas",
      choosePhotos: "Elegir mis fotos",
      selectPhotos: "Seleccione una o más fotos para analizar",
      photoDescription: "Captura de pantalla de cualquier texto o foto cuya legitimidad desea verificar",
      analyze: "Analizar"
    },

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
      title: "Inicia sesion en Serein",
      googleButton: "Continuar con Google",
      securityNote: "Inicio de sesion seguro. Nunca accedemos a tus correos.",
      backToHome: "Volver al inicio",
      loading: "Iniciando sesion...",
      error: "Ha ocurrido un error. Por favor, intentalo de nuevo.",
      or: "O",
      magicLinkTitle: "Iniciar sesion por email",
      magicLinkPlaceholder: "Tu direccion de email",
      magicLinkButton: "Recibir un enlace de conexion",
      magicLinkSent: "Se ha enviado un enlace de conexion a tu email. Revisa tu bandeja de entrada.",
      magicLinkError: "Error al enviar el enlace",
      verifying: "Verificando...",
      verifyError: "Enlace invalido o expirado"
    },

    // Onboarding
    onboarding: {
      step1Title: "Serein analiza tu contenido",
      step1Text: "Pega un enlace, imagen o texto sospechoso. Nuestra IA verifica si es una estafa o contenido enganoso.",

      step2Title: "Tu privacidad esta protegida",
      step2List1: "Sin publicidad",
      step2List2: "Sin venta de datos",
      step2List3: "Sin juicios",
      step2Text: "Serein esta aqui para ayudarte, no para vigilarte.",

      step3Title: "Es muy simple",
      step3Item1: "Copia un enlace sospechoso o haz una captura de pantalla",
      step3Item2: "Pegalo en Serein",
      step3Item3: "Lee el veredicto en segundos",

      next: "Siguiente",
      start: "Empezar a usar Serein"
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
    viewDetails: "Ver detalles",

    // Analyses remaining
    analysesRemaining: "{count} analisis gratuitos restantes",
    analysesRemainingOne: "1 analisis gratuito restante",

    // Account page
    account: {
      title: "Mi cuenta",
      profile: "Perfil",
      subscription: "Suscripción",
      freePlan: "Plan gratuito",
      premiumPlan: "Plan Premium",
      analysesUsed: "{count} análisis utilizados",
      analysesRemaining: "{count} análisis gratuitos restantes",
      validUntil: "Válido hasta",
      upgradeToPremium: "Pasar a Premium",
      history: "Historial de análisis",
      noHistory: "Ningún análisis por el momento",
      logout: "Cerrar sesión",
      language: "Idioma"
    },

    // Paywall
    paywall: {
      title: "Tus analisis gratuitos se han agotado",
      subtitle: "Pasa a Premium para seguir protegiendo a los tuyos",
      price: "29 EUR",
      period: "/ año",
      payWith: "Pagar con Lightning",
      later: "Mas tarde"
    },

    // Payment
    payment: {
      title: "Pago Premium",
      subtitle: "Accede a analisis ilimitados",
      loading: "Cargando...",
      error: "Error al crear la factura",
      retry: "Reintentar",
      scanQR: "Escanea este codigo QR con tu wallet Bitcoin",
      orCopy: "O copia la factura",
      copy: "Copiar",
      copied: "Copiado!",
      waiting: "Esperando el pago...",
      success: "Pago recibido!",
      expired: "Factura expirada",
      redirecting: "Redirigiendo...",
      whyBitcoin: "Por que Bitcoin?",
      reason1: "Pago seguro y anonimo",
      reason2: "Transaccion instantanea",
      reason3: "Sin cargos ocultos",
      back: "Volver"
    }
  }
};

export default translations;
