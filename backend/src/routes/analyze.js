const express = require('express');
const router = express.Router();
const scraper = require('../services/scraper');
const analyzer = require('../services/analyzer');

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL presence
    if (!url) {
      return res.status(400).json({
        error: 'URL requise. Veuillez fournir une URL à analyser.'
      });
    }

    // Validate URL format: must start with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({
        error: 'URL invalide. L\'URL doit commencer par http:// ou https://'
      });
    }

    // Validate URL is well-formed
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Format d\'URL invalide. Veuillez vérifier l\'URL.'
      });
    }

    // Scrape the content
    const scrapedContent = await scraper.scrape(url);

    // Analyze with Claude
    const analysis = await analyzer.analyze(scrapedContent);

    res.json({
      success: true,
      url,
      title: scrapedContent.title,
      analysis
    });

  } catch (error) {
    console.error('Analysis error:', error.message);

    // Return appropriate error message
    const errorMessage = error.message || 'Échec de l\'analyse de l\'URL';
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

// Image analysis route
router.post('/image', async (req, res) => {
  try {
    const { image, mediaType } = req.body;

    // Validate image presence
    if (!image) {
      return res.status(400).json({
        error: 'Image requise. Veuillez fournir une image en base64.'
      });
    }

    // Validate base64 format (remove data URL prefix if present)
    let imageBase64 = image;
    let detectedMediaType = mediaType || 'image/png';

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        detectedMediaType = matches[1];
        imageBase64 = matches[2];
      }
    }

    // Validate media type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(detectedMediaType)) {
      return res.status(400).json({
        error: 'Format d\'image non supporté. Utilisez PNG, JPEG, GIF ou WebP.'
      });
    }

    // Analyze the image with Claude
    const analysis = await analyzer.analyzeImage(imageBase64, detectedMediaType);

    res.json({
      success: true,
      type: 'image',
      analysis
    });

  } catch (error) {
    console.error('Image analysis error:', error.message);

    const errorMessage = error.message || 'Échec de l\'analyse de l\'image';
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router;
