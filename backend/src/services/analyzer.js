const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `Tu es Serein, un assistant bienveillant qui analyse des contenus web pour aider les utilisateurs à détecter la manipulation, la désinformation, et les arnaques. Analyse le contenu fourni et réponds en JSON avec : confidence_score (0-100), verdict (fiable/prudence/suspect), summary (2-3 phrases en français), red_flags (liste des signaux d'alerte détectés), reassurance (message bienveillant et rassurant pour l'utilisateur). Sois factuel mais bienveillant.`;

async function analyze(scrapedContent) {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Clé API Anthropic non configurée. Contactez l\'administrateur.');
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const userPrompt = `Analyse cette page web et fournis ton évaluation en JSON uniquement (pas de texte avant ou après le JSON).

URL: ${scrapedContent.url}
Titre: ${scrapedContent.title}
Description: ${scrapedContent.metaDescription || 'Non disponible'}

Titres de la page:
${scrapedContent.headings.length > 0 ? scrapedContent.headings.join('\n') : 'Aucun titre trouvé'}

Contenu principal:
${scrapedContent.content || 'Contenu non disponible'}

Réponds UNIQUEMENT avec un objet JSON valide dans ce format exact:
{
  "confidence_score": <nombre entre 0 et 100>,
  "verdict": "<fiable|prudence|suspect>",
  "summary": "<résumé en 2-3 phrases>",
  "red_flags": ["<signal 1>", "<signal 2>"],
  "reassurance": "<message bienveillant>"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: SYSTEM_PROMPT
    });

    const responseText = message.content[0].text.trim();

    // Parse JSON response
    let analysis;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      // Return a fallback response
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: 'L\'analyse n\'a pas pu être complétée correctement. Le contenu nécessite une vérification manuelle.',
        red_flags: ['Analyse automatique incomplète'],
        reassurance: 'En cas de doute, prenez le temps de vérifier les informations auprès de sources officielles.'
      };
    }

    // Validate and sanitize the response
    return {
      confidence_score: Math.min(100, Math.max(0, parseInt(analysis.confidence_score) || 50)),
      verdict: ['fiable', 'prudence', 'suspect'].includes(analysis.verdict) ? analysis.verdict : 'prudence',
      summary: String(analysis.summary || 'Analyse non disponible'),
      red_flags: Array.isArray(analysis.red_flags) ? analysis.red_flags.map(String) : [],
      reassurance: String(analysis.reassurance || 'Restez vigilant et vérifiez les informations importantes.')
    };

  } catch (error) {
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

    throw new Error('Échec de l\'analyse du contenu. Veuillez réessayer.');
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
      ? `Analyse cette image (capture d'écran, message, publication, etc.) et fournis ton évaluation en JSON uniquement.`
      : `Analyse ces ${imageCount} images comme un ensemble cohérent (captures d'écran, messages, publications, etc.) et fournis ton évaluation globale en JSON uniquement.`;

    content.push({
      type: 'text',
      text: `${promptText}

Examine attentivement :
- Le contenu textuel visible
- Les éléments visuels (logos, images, mise en page)
- Les signes de manipulation ou de faux
- Les techniques de persuasion ou d'arnaque
${imageCount > 1 ? '- Les liens et cohérence entre les différentes images' : ''}

Réponds UNIQUEMENT avec un objet JSON valide dans ce format exact:
{
  "confidence_score": <nombre entre 0 et 100>,
  "verdict": "<fiable|prudence|suspect>",
  "summary": "<résumé en 2-3 phrases>",
  "red_flags": ["<signal 1>", "<signal 2>"],
  "reassurance": "<message bienveillant>"
}`
    });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: content
        }
      ]
    });

    const responseText = message.content[0].text.trim();

    // Parse JSON response
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      analysis = {
        confidence_score: 50,
        verdict: 'prudence',
        summary: 'L\'analyse des images n\'a pas pu être complétée correctement.',
        red_flags: ['Analyse automatique incomplète'],
        reassurance: 'En cas de doute, vérifiez les informations auprès de sources officielles.'
      };
    }

    // Validate and sanitize the response
    return {
      confidence_score: Math.min(100, Math.max(0, parseInt(analysis.confidence_score) || 50)),
      verdict: ['fiable', 'prudence', 'suspect'].includes(analysis.verdict) ? analysis.verdict : 'prudence',
      summary: String(analysis.summary || 'Analyse non disponible'),
      red_flags: Array.isArray(analysis.red_flags) ? analysis.red_flags.map(String) : [],
      reassurance: String(analysis.reassurance || 'Restez vigilant et vérifiez les informations importantes.')
    };

  } catch (error) {
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

    throw new Error('Échec de l\'analyse des images. Veuillez réessayer.');
  }
}

module.exports = { analyze, analyzeImages };
