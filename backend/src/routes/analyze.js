const express = require('express');
const router = express.Router();
const scraper = require('../services/scraper');
const analyzer = require('../services/analyzer');
const { getError } = require('../utils/errors');

// Helper to get valid language
function getValidLang(lang) {
  return ['fr', 'en', 'es'].includes(lang) ? lang : 'fr';
}

router.post('/', async (req, res) => {
  const { url, lang } = req.body;
  const validLang = getValidLang(lang);

  try {
    // Validate URL presence
    if (!url) {
      return res.status(400).json({
        error: getError('invalidUrl', validLang)
      });
    }

    // Validate URL format: must start with http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({
        error: getError('invalidUrl', validLang)
      });
    }

    // Validate URL is well-formed
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: getError('invalidUrl', validLang)
      });
    }

    // Scrape the content
    const scrapedContent = await scraper.scrape(url);

    // Analyze with Claude
    const analysis = await analyzer.analyze(scrapedContent, validLang);

    res.json({
      success: true,
      url,
      title: scrapedContent.title,
      analysis
    });

  } catch (error) {
    console.error('Analysis error:', error.message);

    const errorMessage = error.message || getError('analysisFailed', validLang);
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

// Image analysis route (supports multiple images)
router.post('/image', async (req, res) => {
  const { images, lang } = req.body;
  const validLang = getValidLang(lang);

  try {
    // Validate images presence
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        error: getError('noImages', validLang)
      });
    }

    // Validate max images
    if (images.length > 5) {
      return res.status(400).json({
        error: getError('tooManyImages', validLang)
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
        const errorMsg = {
          fr: `Image ${i + 1}: Format non supporté. Utilisez PNG, JPEG, GIF ou WebP.`,
          en: `Image ${i + 1}: Unsupported format. Use PNG, JPEG, GIF or WebP.`,
          es: `Imagen ${i + 1}: Formato no soportado. Usa PNG, JPEG, GIF o WebP.`
        };
        return res.status(400).json({
          error: errorMsg[validLang]
        });
      }

      processedImages.push({
        data: imageData,
        mediaType: mediaType
      });
    }

    // Analyze all images with Claude
    const analysis = await analyzer.analyzeImages(processedImages, validLang);

    res.json({
      success: true,
      type: 'image',
      imageCount: processedImages.length,
      analysis
    });

  } catch (error) {
    console.error('Image analysis error:', error.message);

    const errorMessage = error.message || getError('analysisFailed', validLang);
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

// Text analysis route
router.post('/text', async (req, res) => {
  const { text, lang } = req.body;
  const validLang = getValidLang(lang);

  try {
    // Validate text presence
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: getError('noText', validLang)
      });
    }

    // Validate text length
    if (text.length > 10000) {
      return res.status(400).json({
        error: getError('textTooLong', validLang)
      });
    }

    // Analyze with Claude
    const analysis = await analyzer.analyzeText(text, validLang);

    res.json({
      success: true,
      type: 'text',
      textLength: text.length,
      analysis
    });

  } catch (error) {
    console.error('Text analysis error:', error.message);

    const errorMessage = error.message || getError('analysisFailed', validLang);
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router;
