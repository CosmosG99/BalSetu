import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { i18nMiddleware } from './src/middleware/i18n.js';
import { seedDemoData } from './src/scripts/seedDemo.js';

// Feature Route Modules
import reportsRouter from './src/routes/reports.js';
import whatsappRouter from './src/routes/whatsapp.js';
import casesRouter from './src/routes/cases.js';
import trackingRouter from './src/routes/tracking.js';
import dashboardRouter from './src/routes/dashboard.js';
import routingRouter from './src/routes/routing.js';
import matchingRouter from './src/routes/matching.js';
import mapRouter from './src/routes/map.js';
import notificationsRouter from './src/routes/notifications.js';
import reportersRouter from './src/routes/reporters.js';
import adminRouter from './src/routes/admin.js';
import demoRouter from './src/routes/demo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const DEMO_MODE = process.env.DEMO_MODE === 'true';

const hasValue = (value) => Boolean(value && value.trim());
const hasRealAnthropicKey = hasValue(process.env.ANTHROPIC_API_KEY) && process.env.ANTHROPIC_API_KEY.trim() !== 'your_anthropic_api_key_here';

console.log('[RAKSHAK] Runtime configuration summary:');
console.log(`  - NODE_ENV: ${NODE_ENV}`);
console.log(`  - DEMO_MODE: ${DEMO_MODE ? 'enabled' : 'disabled'}`);
console.log(`  - GROQ_API_KEY: ${hasValue(process.env.GROQ_API_KEY) ? 'configured' : 'missing'}`);
console.log(`  - ANTHROPIC_API_KEY: ${hasRealAnthropicKey ? 'configured' : 'missing or placeholder'}`);
console.log(`  - FIREBASE_PROJECT_ID: ${hasValue(process.env.FIREBASE_PROJECT_ID) ? process.env.FIREBASE_PROJECT_ID : 'missing'}`);
console.log(`  - FIREBASE_CLIENT_EMAIL: ${hasValue(process.env.FIREBASE_CLIENT_EMAIL) ? 'configured' : 'missing'}`);
console.log(`  - FIREBASE_STORAGE_BUCKET: ${hasValue(process.env.FIREBASE_STORAGE_BUCKET) ? process.env.FIREBASE_STORAGE_BUCKET : 'missing'}`);
console.log(`  - TWILIO_ACCOUNT_SID: ${hasValue(process.env.TWILIO_ACCOUNT_SID) ? 'configured' : 'missing'}`);
console.log(`  - TWILIO_WHATSAPP_NUMBER: ${hasValue(process.env.TWILIO_WHATSAPP_NUMBER) ? process.env.TWILIO_WHATSAPP_NUMBER : 'missing'}`);
console.log(`  - GOOGLE_MAPS_API_KEY: ${hasValue(process.env.VITE_GOOGLE_MAPS_API_KEY) ? 'configured in frontend env' : 'missing in frontend env'}`);

// Security & Parsing Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
// Twilio sends application/x-www-form-urlencoded payloads
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(i18nMiddleware);

// Root & Health Status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'RAKSHAK Child Safety Incident Reporting & Case Management Backend',
    version: '1.0.0',
    demoMode: DEMO_MODE,
    timestamp: new Date().toISOString()
  });
});

// Feature Routes Mounting (Matches Section 5 API Specification)
app.use('/api/reports', reportsRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/cases', casesRouter);
app.use('/api/track', trackingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api', routingRouter); // mounts /api/cases/:id/auto-route
app.use('/api/matching', matchingRouter);
app.use('/api/map', mapRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reporters', reportersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/demo', demoRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Consistent Global Error Handler (Coding Convention: { error: { code, message } })
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred on the RAKSHAK backend.'
    }
  });
});

// Start Server & optionally seed demo data in development / demo mode
const server = app.listen(PORT, async () => {
  console.log(`\n🛡️  ======================================================`);
  console.log(`🛡️  RAKSHAK Backend API Server running on port ${PORT}`);
  console.log(`🛡️  Environment: ${NODE_ENV}`);
  console.log(`🛡️  Demo Mode: ${DEMO_MODE ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🛡️  Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`🛡️  ======================================================\n`);

  if (DEMO_MODE) {
    try {
      await seedDemoData();
    } catch (seedErr) {
      console.error('Initial demo seed error:', seedErr.message);
    }
  }
});

export default app;
export { server };
