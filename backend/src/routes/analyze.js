const express = require('express');
const router = express.Router();
const scraper = require('../services/scraper');
const analyzer = require('../services/analyzer');

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Scrape the content
    const scrapedContent = await scraper.scrape(url);

    // Analyze with Claude
    const analysis = await analyzer.analyze(scrapedContent);

    res.json({
      success: true,
      url,
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze URL' });
  }
});

module.exports = router;
