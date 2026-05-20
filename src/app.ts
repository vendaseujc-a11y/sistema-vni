import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crmRouter from './modules/crm/crm.routes.js';
import companiesRouter from './modules/companies/companies.routes.js';
import stockRouter from './modules/stock/stock.routes.js';
import salesRouter from './modules/sales/sales.routes.js';
import financialRouter from './modules/financial/financial.routes.js';
import { requireAuth } from './middlewares/auth.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { dashboardHTML } from './modules/dashboard/dashboard.js';

const app = express();

// Secure the app with Helmet headers
app.use(helmet({
  contentSecurityPolicy: false // Disabled for developer dashboard to run inline scripts & external Google Fonts smoothly
}));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*', // Customize this to your frontend domains in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint serving the beautiful developer & admin console dashboard
app.get('/', (req, res) => {
  const html = dashboardHTML
    .replace('__SUPABASE_URL__', process.env.SUPABASE_URL || '')
    .replace('__SUPABASE_ANON_KEY__', process.env.SUPABASE_ANON_KEY || '');
  res.send(html);
});

// Modular Routes (Protected by authenticating JWT middleware)
app.use('/api/companies', requireAuth, companiesRouter);
app.use('/api/crm/customers', requireAuth, crmRouter);
app.use('/api/stock/products', requireAuth, stockRouter);
app.use('/api/sales/orders', requireAuth, salesRouter);
app.use('/api/financial/transactions', requireAuth, financialRouter);

// Fallback for route not found
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Não encontrado',
    message: `A rota ${req.originalUrl} não foi mapeada no servidor.`
  });
});

// Global Error Handling Middleware (must be registered after all routes)
app.use(errorHandler);

export default app;
