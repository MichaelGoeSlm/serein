const Anthropic = require('@anthropic-ai/sdk');
const { getError } = require('../utils/errors');

// Multilingual system prompts
const SYSTEM_PROMPTS = {
  fr: `Tu es Serein, un assistant bienveillant qui analyse des contenus web et emails pour aider les utilisateurs à détecter la manipulation, la désinformation, et les arnaques.

=== RECHERCHE WEB ===

AVANT d'analyser, utilise la recherche web pour :
- Vérifier si l'événement mentionné existe dans des sources fiables
- Confirmer que l'entreprise/site web est légitime
- Chercher des signalements d'arnaque liés à ce contenu
Base ton analyse sur les résultats de recherche ET le contenu soumis.

=== RÈGLES CRITIQUES ===

1. DATES ET ÉVÉNEMENTS RÉCENTS :
- Tu ne connais PAS les événements après avril 2024
- Une date en 2025 ou 2026 N'EST PAS un signal d'alerte
- Ne JAMAIS dire qu'une date est "incohérente" ou "future"
- Si tu ne connais pas un événement récent, cela ne signifie PAS qu'il est faux

2. EMAILS LÉGITIMES - Ces éléments sont des SIGNES DE CONFIANCE (pas des alertes) :
- L'expéditeur utilise le même domaine que l'entreprise
- Présence d'une adresse physique complète
- Présence de "mots-clés sécurisés" ou codes anti-phishing personnalisés
- Liens de désinscription fonctionnels
- Liens vers réseaux sociaux officiels

3. VRAIS SIGNAUX D'ALERTE (utilise UNIQUEMENT ceux-ci) :
- Demandes d'argent urgentes ou de données bancaires/mots de passe
- Domaine de l'expéditeur DIFFÉRENT de l'entreprise prétendue
- Fautes d'orthographe ou grammaire grossières
- Menaces ou pression excessive
- Liens suspects vers des domaines inconnus
- Promesses de gains irréalistes

=== POUR LES EMAILS ===

Vérifie particulièrement :
- L'expéditeur correspond-il au domaine de l'entreprise ?
- Y a-t-il des demandes de données personnelles ou bancaires ?
- Le ton est-il menaçant ou urgent ?

Utilise ces formulations :
- Si expéditeur suspect : "L'expéditeur ne semble pas correspondre à l'entreprise mentionnée"
- Si promesse financière : "Ce message contient des promesses financières qui semblent irréalistes"
- Si demande de données : "Attention : ne communiquez jamais vos identifiants par email"
- Si légitime : "Cet email semble provenir d'une source légitime"

=== FORMAT DE RÉPONSE ===

Réponds UNIQUEMENT en JSON valide, en FRANÇAIS :
{
  "confidence_score": (0-100, où 100 = très fiable),
  "verdict": "fiable" ou "prudence" ou "suspect",
  "summary": "(2-3 phrases EN FRANÇAIS)",
  "red_flags": ["liste des problèmes EN FRANÇAIS, tableau vide si aucun"],
  "reassurance": "(message bienveillant EN FRANÇAIS)"
}

=== IMPORTANT ===
- En cas de doute, privilégie "fiable" ou "prudence" plutôt que "suspect"
- Sois bienveillant et aide l'utilisateur à se sentir en sécurité
- TOUTES tes réponses doivent être en FRANÇAIS`,

  en: `You are Serein, a friendly assistant that analyzes web content and emails to help users detect manipulation, misinformation, and scams.

=== WEB SEARCH ===

BEFORE analyzing, use web search to:
- Verify if the mentioned event exists in reliable sources
- Confirm that the company/website is legitimate
- Search for scam reports related to this content
Base your analysis on search results AND the submitted content.

=== CRITICAL RULES ===

1. RECENT DATES AND EVENTS:
- You don't know events after April 2024
- A date in 2025 or 2026 IS NOT a red flag
- NEVER say a date is "inconsistent" or "in the future"
- If you don't know a recent event, it does NOT mean it's false

2. LEGITIMATE EMAILS - These elements are TRUST SIGNS (not alerts):
- Sender uses the same domain as the company
- Presence of a complete physical address
- Presence of "security keywords" or personalized anti-phishing codes
- Working unsubscribe links
- Links to official social media

3. REAL RED FLAGS (use ONLY these):
- Urgent money requests or banking data/password requests
- Sender domain DIFFERENT from the claimed company
- Gross spelling or grammar mistakes
- Threats or excessive pressure
- Suspicious links to unknown domains
- Unrealistic profit promises

=== FOR EMAILS ===

Check particularly:
- Does the sender match the company domain?
- Are there requests for personal or banking data?
- Is the tone threatening or urgent?

Use these formulations:
- If suspicious sender: "The sender doesn't seem to match the mentioned company"
- If financial promise: "This message contains financial promises that seem unrealistic"
- If data request: "Warning: never share your credentials via email"
- If legitimate: "This email seems to come from a legitimate source"

=== RESPONSE FORMAT ===

Respond ONLY with valid JSON, in ENGLISH:
{
  "confidence_score": (0-100, where 100 = very reliable),
  "verdict": "fiable" or "prudence" or "suspect",
  "summary": "(2-3 sentences IN ENGLISH)",
  "red_flags": ["list of issues IN ENGLISH, empty array if none"],
  "reassurance": "(friendly message IN ENGLISH)"
}

=== IMPORTANT ===
- When in doubt, prefer "fiable" or "prudence" over "suspect"
- Be friendly and help the user feel secure
- ALL your responses must be in ENGLISH`,

  es: `Eres Serein, un asistente amigable que analiza contenido web y emails para ayudar a los usuarios a detectar manipulación, desinformación y estafas.

=== BÚSQUEDA WEB ===

ANTES de analizar, usa la búsqueda web para:
- Verificar si el evento mencionado existe en fuentes confiables
- Confirmar que la empresa/sitio web es legítimo
- Buscar reportes de estafas relacionados con este contenido
Basa tu análisis en los resultados de búsqueda Y el contenido enviado.

=== REGLAS CRÍTICAS ===

1. FECHAS Y EVENTOS RECIENTES:
- No conoces eventos después de abril 2024
- Una fecha en 2025 o 2026 NO ES una señal de alerta
- NUNCA digas que una fecha es "inconsistente" o "futura"
- Si no conoces un evento reciente, NO significa que sea falso

2. EMAILS LEGÍTIMOS - Estos elementos son SIGNOS DE CONFIANZA (no alertas):
- El remitente usa el mismo dominio que la empresa
- Presencia de una dirección física completa
- Presencia de "palabras clave de seguridad" o códigos anti-phishing personalizados
- Enlaces de cancelación de suscripción funcionales
- Enlaces a redes sociales oficiales

3. VERDADERAS SEÑALES DE ALERTA (usa SOLO estas):
- Solicitudes urgentes de dinero o datos bancarios/contraseñas
- Dominio del remitente DIFERENTE de la empresa supuesta
- Errores de ortografía o gramática graves
- Amenazas o presión excesiva
- Enlaces sospechosos a dominios desconocidos
- Promesas de ganancias irrealistas

=== PARA EMAILS ===

Verifica particularmente:
- ¿El remitente corresponde al dominio de la empresa?
- ¿Hay solicitudes de datos personales o bancarios?
- ¿El tono es amenazante o urgente?

Usa estas formulaciones:
- Si remitente sospechoso: "El remitente no parece corresponder a la empresa mencionada"
- Si promesa financiera: "Este mensaje contiene promesas financieras que parecen irrealistas"
- Si solicitud de datos: "Atención: nunca compartas tus credenciales por email"
- Si legítimo: "Este email parece provenir de una fuente legítima"

=== FORMATO DE RESPUESTA ===

Responde SOLO con JSON válido, en ESPAÑOL:
{
  "confidence_score": (0-100, donde 100 = muy confiable),
  "verdict": "fiable" o "prudence" o "suspect",
  "summary": "(2-3 oraciones EN ESPAÑOL)",
  "red_flags": ["lista de problemas EN ESPAÑOL, array vacío si ninguno"],
  "reassurance": "(mensaje amigable EN ESPAÑOL)"
}

=== IMPORTANTE ===
- En caso de duda, prefiere "fiable" o "prudence" en lugar de "suspect"
- Sé amigable y ayuda al usuario a sentirse seguro
- TODAS tus respuestas deben ser en ESPAÑOL`
};

// Fallback messages by language
const FALLBACK_MESSAGES = {
  fr: {
    summary: 'L\'analyse n\'a pas pu être complétée correctement.',
    redFlag: 'Analyse automatique incomplète',
    reassurance: 'En cas de doute, vérifiez les informations auprès de sources officielles.'
  },
  en: {
    summary: 'The analysis could not be completed correctly.',
    redFlag: 'Automatic analysis incomplete',
    reassurance: 'When in doubt, verify information from official sources.'
  },
  es: {
    summary: 'El análisis no pudo completarse correctamente.',
    redFlag: 'Análisis automático incompleto',
    reassurance: 'En caso de duda, verifica la información en fuentes oficiales.'
  }
};

// Web search tool configuration
const WEB_SEARCH_TOOL = {
  type: "web_search_20250305",
  name: "web_search",
  max_uses: 3
};

// Get valid language
function getValidLang(lang) {
  return ['fr', 'en', 'es'].includes(lang) ? lang : 'fr';
}

// Helper function to extract JSON from response with multiple content blocks
function extractJsonFromResponse(response) {
  let jsonText = null;

  for (let i = response.content.length - 1; i >= 0; i--) {
    const block = response.content[i];
    if (block.type === 'text' && block.text) {
      const jsonMatch = block.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
        break;
      }
    }
  }

  if (!jsonText) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonText);
}

// Helper function to sanitize analysis result
function sanitizeAnalysis(analysis, lang = 'fr') {
  const fallback = FALLBACK_MESSAGES[getValidLang(lang)];
  return {
    confidence_score: Math.min(100, Math.max(0, parseInt(analysis.confidence_score) || 50)),
    verdict: ['fiable', 'prudence', 'suspect'].includes(analysis.verdict) ? analysis.verdict : 'prudence',
    summary: String(analysis.summary || fallback.summary),
    red_flags: Array.isArray(analysis.red_flags) ? analysis.red_flags.map(String) : [],
    reassurance: String(analysis.reassurance || fallback.reassurance)
  };
}

// Helper function to handle API errors
function handleApiError(error, lang = 'fr') {
  console.error('Anthropic API error:', error);

  if (error.status === 401) {
    throw new Error(getError('apiKeyMissing', lang));
  }

  if (error.status === 429) {
    throw new Error(getError('rateLimited', lang));
  }

  if (error.status === 500 || error.status === 503) {
    throw new Error(getError('analysisFailed', lang));
  }

  throw new Error(getError('analysisFailed', lang));
}

async function analyze(scrapedContent, lang = 'fr') {
  const validLang = getValidLang(lang);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(getError('apiKeyMissing', validLang));
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const userPrompt = validLang === 'fr'
      ? `Analyse cette page web. Utilise d'abord la recherche web pour vérifier la légitimité du site et du contenu.

URL: ${scrapedContent.url}
Titre: ${scrapedContent.title}
Description: ${scrapedContent.metaDescription || 'Non disponible'}

Titres de la page:
${scrapedContent.headings.length > 0 ? scrapedContent.headings.join('\n') : 'Aucun titre trouvé'}

Contenu principal:
${scrapedContent.content || 'Contenu non disponible'}

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide en français.`
      : validLang === 'en'
      ? `Analyze this web page. First use web search to verify the legitimacy of the site and content.

URL: ${scrapedContent.url}
Title: ${scrapedContent.title}
Description: ${scrapedContent.metaDescription || 'Not available'}

Page headings:
${scrapedContent.headings.length > 0 ? scrapedContent.headings.join('\n') : 'No headings found'}

Main content:
${scrapedContent.content || 'Content not available'}

After your search, respond ONLY with a valid JSON object in English.`
      : `Analiza esta página web. Primero usa la búsqueda web para verificar la legitimidad del sitio y contenido.

URL: ${scrapedContent.url}
Título: ${scrapedContent.title}
Descripción: ${scrapedContent.metaDescription || 'No disponible'}

Títulos de la página:
${scrapedContent.headings.length > 0 ? scrapedContent.headings.join('\n') : 'Sin títulos encontrados'}

Contenido principal:
${scrapedContent.content || 'Contenido no disponible'}

Después de tu búsqueda, responde SOLO con un objeto JSON válido en español.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPTS[validLang],
      tools: [WEB_SEARCH_TOOL],
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    let analysis;
    try {
      analysis = extractJsonFromResponse(message);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', message.content);
      const fallback = FALLBACK_MESSAGES[validLang];
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: fallback.summary,
        red_flags: [fallback.redFlag],
        reassurance: fallback.reassurance
      };
    }

    return sanitizeAnalysis(analysis, validLang);

  } catch (error) {
    handleApiError(error, validLang);
  }
}

async function analyzeImages(images, lang = 'fr') {
  const validLang = getValidLang(lang);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(getError('apiKeyMissing', validLang));
  }

  if (!images || images.length === 0) {
    throw new Error(getError('noImages', validLang));
  }

  if (images.length > 5) {
    throw new Error(getError('tooManyImages', validLang));
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const content = [];

    images.forEach((img) => {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mediaType || 'image/png',
          data: img.data
        }
      });
    });

    const imageCount = images.length;

    const promptTexts = {
      fr: imageCount === 1
        ? `Analyse cette image (capture d'écran, message, publication, email, etc.).

IMPORTANT: Utilise d'abord la recherche web pour vérifier la légitimité.

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide en français.`
        : `Analyse ces ${imageCount} images comme un ensemble cohérent.

IMPORTANT: Utilise d'abord la recherche web pour vérifier la légitimité.

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide en français.`,
      en: imageCount === 1
        ? `Analyze this image (screenshot, message, post, email, etc.).

IMPORTANT: First use web search to verify legitimacy.

After your search, respond ONLY with a valid JSON object in English.`
        : `Analyze these ${imageCount} images as a coherent set.

IMPORTANT: First use web search to verify legitimacy.

After your search, respond ONLY with a valid JSON object in English.`,
      es: imageCount === 1
        ? `Analiza esta imagen (captura de pantalla, mensaje, publicación, email, etc.).

IMPORTANTE: Primero usa la búsqueda web para verificar la legitimidad.

Después de tu búsqueda, responde SOLO con un objeto JSON válido en español.`
        : `Analiza estas ${imageCount} imágenes como un conjunto coherente.

IMPORTANTE: Primero usa la búsqueda web para verificar la legitimidad.

Después de tu búsqueda, responde SOLO con un objeto JSON válido en español.`
    };

    content.push({
      type: 'text',
      text: promptTexts[validLang]
    });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPTS[validLang],
      tools: [WEB_SEARCH_TOOL],
      messages: [
        {
          role: 'user',
          content: content
        }
      ]
    });

    let analysis;
    try {
      analysis = extractJsonFromResponse(message);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', message.content);
      const fallback = FALLBACK_MESSAGES[validLang];
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: fallback.summary,
        red_flags: [fallback.redFlag],
        reassurance: fallback.reassurance
      };
    }

    return sanitizeAnalysis(analysis, validLang);

  } catch (error) {
    handleApiError(error, validLang);
  }
}

async function analyzeText(text, lang = 'fr') {
  const validLang = getValidLang(lang);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(getError('apiKeyMissing', validLang));
  }

  if (!text || text.trim().length === 0) {
    throw new Error(getError('noText', validLang));
  }

  if (text.length > 10000) {
    throw new Error(getError('textTooLong', validLang));
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const promptTexts = {
      fr: `Analyse ce texte (email, message, ou contenu suspect). Utilise d'abord la recherche web pour vérifier la légitimité des informations mentionnées.

TEXTE À ANALYSER:
---
${text}
---

IMPORTANT: Utilise la recherche web pour vérifier si l'entreprise/expéditeur existe et chercher des signalements d'arnaque similaires.

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide en français.`,
      en: `Analyze this text (email, message, or suspicious content). First use web search to verify the legitimacy of the mentioned information.

TEXT TO ANALYZE:
---
${text}
---

IMPORTANT: Use web search to verify if the company/sender exists and search for similar scam reports.

After your search, respond ONLY with a valid JSON object in English.`,
      es: `Analiza este texto (email, mensaje, o contenido sospechoso). Primero usa la búsqueda web para verificar la legitimidad de la información mencionada.

TEXTO A ANALIZAR:
---
${text}
---

IMPORTANTE: Usa la búsqueda web para verificar si la empresa/remitente existe y buscar reportes de estafas similares.

Después de tu búsqueda, responde SOLO con un objeto JSON válido en español.`
    };

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPTS[validLang],
      tools: [WEB_SEARCH_TOOL],
      messages: [
        {
          role: 'user',
          content: promptTexts[validLang]
        }
      ]
    });

    let analysis;
    try {
      analysis = extractJsonFromResponse(message);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', message.content);
      const fallback = FALLBACK_MESSAGES[validLang];
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: fallback.summary,
        red_flags: [fallback.redFlag],
        reassurance: fallback.reassurance
      };
    }

    return sanitizeAnalysis(analysis, validLang);

  } catch (error) {
    handleApiError(error, validLang);
  }
}

module.exports = { analyze, analyzeImages, analyzeText };
