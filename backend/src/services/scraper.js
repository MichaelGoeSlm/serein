const axios = require('axios');
const cheerio = require('cheerio');

async function scrape(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, nav, footer, header').remove();

    // Extract text content
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    // Extract headings
    const headings = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        headings.push({
          level: el.tagName.toLowerCase(),
          text
        });
      }
    });

    // Extract links
    const links = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text && href.startsWith('http')) {
        links.push({ href, text });
      }
    });

    return {
      url,
      title,
      metaDescription,
      headings: headings.slice(0, 20),
      links: links.slice(0, 20),
      content: bodyText.slice(0, 5000)
    };
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
}

module.exports = { scrape };
