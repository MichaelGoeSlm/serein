const axios = require('axios');
const cheerio = require('cheerio');

const MAX_CONTENT_LENGTH = 5000;
const REQUEST_TIMEOUT = 15000;

async function scrape(url) {
  try {
    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
      },
      timeout: REQUEST_TIMEOUT,
      maxRedirects: 5,
      validateStatus: (status) => status < 400
    });

    const $ = cheerio.load(response.data);

    // Remove non-content elements
    $('script, style, nav, footer, header, aside, iframe, noscript, svg, form').remove();
    $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();
    $('.nav, .navbar, .footer, .sidebar, .advertisement, .ads, .cookie-banner').remove();

    // Extract title
    const title = $('title').first().text().trim() ||
                  $('h1').first().text().trim() ||
                  'Sans titre';

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') ||
                           $('meta[property="og:description"]').attr('content') ||
                           '';

    // Extract main text from paragraphs
    const paragraphs = [];
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      // Filter out very short paragraphs (likely not content)
      if (text.length > 20) {
        paragraphs.push(text);
      }
    });

    // Join paragraphs and limit to max length
    let content = paragraphs.join('\n\n');
    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.slice(0, MAX_CONTENT_LENGTH) + '...';
    }

    // If no paragraphs found, try to get body text
    if (content.length < 100) {
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      content = bodyText.slice(0, MAX_CONTENT_LENGTH);
    }

    // Extract headings for context
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) {
        headings.push(text);
      }
    });

    return {
      url,
      title: title.slice(0, 200),
      metaDescription: metaDescription.slice(0, 500),
      headings: headings.slice(0, 10),
      content
    };

  } catch (error) {
    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      const err = new Error('Impossible de se connecter au site. Le serveur refuse la connexion.');
      err.statusCode = 502;
      throw err;
    }

    if (error.code === 'ENOTFOUND') {
      const err = new Error('Site introuvable. Vérifiez que l\'URL est correcte.');
      err.statusCode = 404;
      throw err;
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      const err = new Error('Le site met trop de temps à répondre. Réessayez plus tard.');
      err.statusCode = 504;
      throw err;
    }

    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        const err = new Error('Accès refusé par le site. Le site bloque peut-être les requêtes automatiques.');
        err.statusCode = 403;
        throw err;
      }
      if (status === 404) {
        const err = new Error('Page non trouvée. Vérifiez que l\'URL est correcte.');
        err.statusCode = 404;
        throw err;
      }
      const err = new Error(`Le site a retourné une erreur (code ${status}).`);
      err.statusCode = status;
      throw err;
    }

    // Generic error
    const err = new Error('Impossible de récupérer le contenu de la page. Vérifiez l\'URL et réessayez.');
    err.statusCode = 500;
    throw err;
  }
}

module.exports = { scrape };
