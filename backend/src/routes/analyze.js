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

// Image analysis route (supports multiple images)
router.post('/image', async (req, res) => {
  try {
    const { images } = req.body;

    // Validate images presence
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        error: 'Images requises. Veuillez fournir un tableau d\'images en base64.'
      });
    }

    // Validate max images
    if (images.length > 5) {
      return res.status(400).json({
        error: 'Maximum 5 images autorisées.'
      });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    const processedImages = [];

    // Process each image
    for (let i = 0; i < images.length; i++) {
      let imageData = images[i];
      let mediaType = 'image/png';

      // Handle data URL format
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mediaType = matches[1];
          imageData = matches[2];
        }
      }

      // Validate media type
      if (!allowedTypes.includes(mediaType)) {
        return res.status(400).json({
          error: `Image ${i + 1}: Format non supporté. Utilisez PNG, JPEG, GIF ou WebP.`
        });
      }

      processedImages.push({
        data: imageData,
        mediaType: mediaType
      });
    }

    // Analyze all images with Claude
    const analysis = await analyzer.analyzeImages(processedImages);

    res.json({
      success: true,
      type: 'image',
      imageCount: processedImages.length,
      analysis
    });

  } catch (error) {
    console.error('Image analysis error:', error.message);

    const errorMessage = error.message || 'Échec de l\'analyse des images';
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router;
