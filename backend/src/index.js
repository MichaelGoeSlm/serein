require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust proxy pour Render
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['https://magnificent-beijinho-f18e1c.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});
app.use(limiter);

// Routes
const analyzeRoutes = require('./routes/analyze');
const paymentRoutes = require('./routes/payment');

app.use('/api/analyze', analyzeRoutes);
app.use('/api/payment', paymentRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serein backend running on port ${PORT}`);
});
