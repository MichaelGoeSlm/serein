const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `Tu es Serein, un assistant bienveillant qui analyse des contenus web et emails pour aider les utilisateurs à détecter la manipulation, la désinformation, et les arnaques.

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
- L'expéditeur utilise le même domaine que l'entreprise (ex: pierre@waltio.com pour Waltio)
- Présence d'une adresse physique complète
- Présence de "mots-clés sécurisés" ou codes anti-phishing personnalisés
- Liens de désinscription fonctionnels
- Liens vers réseaux sociaux officiels (LinkedIn, Twitter, YouTube)
- Chiffrement TLS mentionné
- Option "Gérer mes préférences"

3. VRAIS SIGNAUX D'ALERTE (utilise UNIQUEMENT ceux-ci) :
- Demandes d'argent urgentes ou de données bancaires/mots de passe
- Domaine de l'expéditeur DIFFÉRENT de l'entreprise prétendue (ex: amazon-security@gmail.com)
- Fautes d'orthographe ou grammaire grossières
- Menaces ou pression excessive ("votre compte sera fermé dans 24h")
- Liens suspects vers des domaines inconnus
- Pièces jointes .exe, .zip non sollicitées
- Promesses de gains irréalistes
- Absence totale d'identité de l'expéditeur

4. SOURCES D'ACTUALITÉS :
- Les sites comme actu.fr, lemonde.fr, lefigaro.fr, etc. sont des sources légitimes
- Un article de presse locale avec une URL normale est généralement fiable
- Les paramètres Facebook/tracking dans une URL ne sont PAS suspects (c'est normal quand on partage)

=== FORMAT DE RÉPONSE ===

Réponds UNIQUEMENT en JSON valide :
{
  "confidence_score": (0-100, où 100 = très fiable),
  "verdict": "fiable" ou "prudence" ou "suspect",
  "summary": "(2-3 phrases en français expliquant ton analyse)",
  "red_flags": ["liste uniquement les VRAIS problèmes détectés, tableau vide si aucun"],
  "reassurance": "(message bienveillant et rassurant)"
}

=== POUR LES EMAILS ===

Vérifie particulièrement :
- L'expéditeur correspond-il au domaine de l'entreprise ?
- Y a-t-il des demandes de données personnelles ou bancaires ?
- Le ton est-il menaçant ou urgent ?

Utilise ces formulations adaptées dans tes réponses :
- Si expéditeur suspect : "L'expéditeur ne semble pas correspondre à l'entreprise mentionnée"
- Si promesse financière : "Ce message contient des promesses financières qui semblent irréalistes"
- Si demande de données : "Attention : ne communiquez jamais vos identifiants par email"
- Si légitime : "Cet email semble provenir d'une source légitime"

=== IMPORTANT ===
- En cas de doute, privilégie "fiable" ou "prudence" plutôt que "suspect"
- Un email d'entreprise avec domaine cohérent est probablement légitime
- Un article de presse récent est probablement vrai même si tu ne connais pas l'événement
- Sois bienveillant et aide l'utilisateur à se sentir en sécurité`;

// Web search tool configuration
const WEB_SEARCH_TOOL = {
  type: "web_search_20250305",
  name: "web_search",
  max_uses: 3
};

// Helper function to extract JSON from response with multiple content blocks
function extractJsonFromResponse(response) {
  // Find the last text block containing JSON
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
function sanitizeAnalysis(analysis) {
  return {
    confidence_score: Math.min(100, Math.max(0, parseInt(analysis.confidence_score) || 50)),
    verdict: ['fiable', 'prudence', 'suspect'].includes(analysis.verdict) ? analysis.verdict : 'prudence',
    summary: String(analysis.summary || 'Analyse non disponible'),
    red_flags: Array.isArray(analysis.red_flags) ? analysis.red_flags.map(String) : [],
    reassurance: String(analysis.reassurance || 'Restez vigilant et vérifiez les informations importantes.')
  };
}

// Helper function to handle API errors
function handleApiError(error) {
  console.error('Anthropic API error:', error);

  if (error.status === 401) {
    throw new Error('Clé API invalide. Contactez l\'administrateur.');
  }

  if (error.status === 429) {
    throw new Error('Trop de requêtes vers l\'API. Veuillez réessayer dans quelques instants.');
  }

  if (error.status === 500 || error.status === 503) {
    throw new Error('Le service d\'analyse est temporairement indisponible. Réessayez plus tard.');
  }

  throw new Error('Échec de l\'analyse. Veuillez réessayer.');
}

async function analyze(scrapedContent) {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Clé API Anthropic non configurée. Contactez l\'administrateur.');
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const userPrompt = `Analyse cette page web. Utilise d'abord la recherche web pour vérifier la légitimité du site et du contenu.

URL: ${scrapedContent.url}
Titre: ${scrapedContent.title}
Description: ${scrapedContent.metaDescription || 'Non disponible'}

Titres de la page:
${scrapedContent.headings.length > 0 ? scrapedContent.headings.join('\n') : 'Aucun titre trouvé'}

Contenu principal:
${scrapedContent.content || 'Contenu non disponible'}

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide dans ce format exact:
{
  "confidence_score": <nombre entre 0 et 100>,
  "verdict": "<fiable|prudence|suspect>",
  "summary": "<résumé en 2-3 phrases mentionnant ce que tu as trouvé en recherche>",
  "red_flags": ["<signal 1>", "<signal 2>"],
  "reassurance": "<message bienveillant>"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [WEB_SEARCH_TOOL],
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    // Extract JSON from potentially multi-block response
    let analysis;
    try {
      analysis = extractJsonFromResponse(message);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', message.content);
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: 'L\'analyse n\'a pas pu être complétée correctement. Le contenu nécessite une vérification manuelle.',
        red_flags: ['Analyse automatique incomplète'],
        reassurance: 'En cas de doute, prenez le temps de vérifier les informations auprès de sources officielles.'
      };
    }

    return sanitizeAnalysis(analysis);

  } catch (error) {
    handleApiError(error);
  }
}

async function analyzeImages(images) {
  // images is an array of { data: base64, mediaType: string }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Clé API Anthropic non configurée. Contactez l\'administrateur.');
  }

  if (!images || images.length === 0) {
    throw new Error('Aucune image fournie.');
  }

  if (images.length > 5) {
    throw new Error('Maximum 5 images autorisées.');
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    // Build content array with all images
    const content = [];

    // Add all images first
    images.forEach((img, index) => {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mediaType || 'image/png',
          data: img.data
        }
      });
    });

    // Add the text prompt at the end
    const imageCount = images.length;
    const promptText = imageCount === 1
      ? `Analyse cette image (capture d'écran, message, publication, email, etc.).`
      : `Analyse ces ${imageCount} images comme un ensemble cohérent (captures d'écran, messages, publications, emails, etc.).`;

    content.push({
      type: 'text',
      text: `${promptText}

IMPORTANT: Utilise d'abord la recherche web pour :
- Vérifier si l'entreprise/marque visible est légitime
- Chercher des signalements d'arnaque similaires
- Confirmer l'authenticité des informations visibles

Examine attentivement :
- Le contenu textuel visible
- Les éléments visuels (logos, images, mise en page)
- Les signes de manipulation ou de faux
- Les techniques de persuasion ou d'arnaque
${imageCount > 1 ? '- Les liens et cohérence entre les différentes images' : ''}

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide:
{
  "confidence_score": <nombre entre 0 et 100>,
  "verdict": "<fiable|prudence|suspect>",
  "summary": "<résumé en 2-3 phrases mentionnant ce que tu as trouvé en recherche>",
  "red_flags": ["<signal 1>", "<signal 2>"],
  "reassurance": "<message bienveillant>"
}`
    });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [WEB_SEARCH_TOOL],
      messages: [
        {
          role: 'user',
          content: content
        }
      ]
    });

    // Extract JSON from potentially multi-block response
    let analysis;
    try {
      analysis = extractJsonFromResponse(message);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', message.content);
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: 'L\'analyse des images n\'a pas pu être complétée correctement.',
        red_flags: ['Analyse automatique incomplète'],
        reassurance: 'En cas de doute, vérifiez les informations auprès de sources officielles.'
      };
    }

    return sanitizeAnalysis(analysis);

  } catch (error) {
    handleApiError(error);
  }
}

async function analyzeText(text) {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Clé API Anthropic non configurée. Contactez l\'administrateur.');
  }

  if (!text || text.trim().length === 0) {
    throw new Error('Aucun texte fourni.');
  }

  if (text.length > 10000) {
    throw new Error('Le texte est trop long. Maximum 10 000 caractères.');
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const userPrompt = `Analyse ce texte (email, message, ou contenu suspect). Utilise d'abord la recherche web pour vérifier la légitimité des informations mentionnées.

TEXTE À ANALYSER:
---
${text}
---

IMPORTANT: Utilise la recherche web pour :
- Vérifier si l'entreprise/expéditeur mentionné existe et est légitime
- Chercher des signalements d'arnaque similaires
- Confirmer l'authenticité des informations (numéros, adresses, offres)

Après ta recherche, réponds UNIQUEMENT avec un objet JSON valide:
{
  "confidence_score": <nombre entre 0 et 100>,
  "verdict": "<fiable|prudence|suspect>",
  "summary": "<résumé en 2-3 phrases mentionnant ce que tu as trouvé en recherche>",
  "red_flags": ["<signal 1>", "<signal 2>"],
  "reassurance": "<message bienveillant>"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [WEB_SEARCH_TOOL],
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    // Extract JSON from potentially multi-block response
    let analysis;
    try {
      analysis = extractJsonFromResponse(message);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', message.content);
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: 'L\'analyse du texte n\'a pas pu être complétée correctement.',
        red_flags: ['Analyse automatique incomplète'],
        reassurance: 'En cas de doute, vérifiez les informations auprès de sources officielles.'
      };
    }

    return sanitizeAnalysis(analysis);

  } catch (error) {
    handleApiError(error);
  }
}

module.exports = { analyze, analyzeImages, analyzeText };
