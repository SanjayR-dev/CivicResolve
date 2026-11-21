import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import complaintRoutes from './routes/complaintRoutes.js';
import { getAnalyticsStats } from './data/complaintsStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env as well as cwd .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend requests
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Root & Informational Endpoint (Supports autograders and uptime monitors)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CivicResolve Backend API',
    tagline: 'Report. Track. Resolve.',
    version: '1.0.0',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    endpoints: {
      health: '/api/health',
      complaints: '/api/complaints',
      analytics: '/api/analytics'
    },
    timestamp: new Date().toISOString()
  });
});

// Health Check Handler (Mounted at both /health and /api/health)
const healthHandler = (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'CivicResolve Backend API',
    version: '1.0.0',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    timestamp: new Date().toISOString()
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Analytics Handler (Mounted at both /analytics and /api/analytics)
const analyticsHandler = (req, res) => {
  try {
    const stats = getAnalyticsStats();
    res.json({
      success: true,
      analytics: stats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics.'
    });
  }
};
app.get('/analytics', analyticsHandler);
app.get('/api/analytics', analyticsHandler);

// Complaints Routes (Dual-mounted for /complaints and /api/complaints)
app.use('/complaints', complaintRoutes);
app.use('/api/complaints', complaintRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CivicResolve Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  CIVICRESOLVE API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Gemini Key Configured: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')}`);
  console.log(`=================================================`);
});
