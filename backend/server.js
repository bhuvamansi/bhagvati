import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/auth.routes.js';
import unifiedAuthRoutes from './src/routes/unifiedAuth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import faqRoutes from './src/routes/faq.routes.js';
import archiveRoutes from './src/routes/archive.routes.js';
import siteSettingsRoutes from './src/routes/siteSettings.routes.js';
import newsletterRoutes from './src/routes/newsletter.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import deliveryRoutes from './src/routes/delivery.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const parseOrigins = (...values) =>
  values
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean);

const allowedOrigins = [
  ...new Set(
    parseOrigins(
      process.env.CORS_ALLOWED_ORIGINS,
      process.env.PUBLIC_APP_URL,
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
      'https://localhost:5000',
      'https://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://en.eastern-edition.com',
      'https://eastern-edition.com',
      'https://www.eastern-edition.com'
    )
  ),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'running',
    brand: 'Shree Bhagvati Furniture API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    allowedOrigins,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/unified-auth', unifiedAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/notifications', notificationRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   ✦ Furniture Backend Running               ║');
  console.log(`║   Port     : ${PORT}`);
  console.log(`║   Env      : ${process.env.NODE_ENV || 'development'}`);
  console.log(`║   API      : http://localhost:${PORT}/api`);
  console.log(`║   Origins  : ${allowedOrigins.join(', ')}`);
  console.log('╚══════════════════════════════════════════════╝\n');
});

export default app;