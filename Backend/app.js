require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const validateEnv = require('./config/envSchema');
const logger = require('./config/logger');
const requestId = require('./middleware/requestId');
const errorHandler = require('./middleware/error');
const { swaggerUi, swaggerDocument } = require('./config/swagger');
const { initScheduler } = require('./config/scheduler');

// Routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const recurringRoutes = require('./routes/recurringRoutes');

const env = validateEnv();
const app = express();

// Security Headers & Middlewares
app.use(helmet());
app.use(requestId);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/recurring', recurringRoutes);

// Global Error Handler
app.use(errorHandler);

// Database Connection & Server Bootstrap
const PORT = env.PORT || 5000;
const startServer = async () => {
  try {
    if (env.NODE_ENV !== 'test') {
      await mongoose.connect(env.MONGO_URI);
      logger.info(`[Database] Connected to MongoDB at ${env.MONGO_URI}`);
      
      initScheduler();

      app.listen(PORT, () => {
        logger.info(`[Server] Finance Tracker API running on http://localhost:${PORT}`);
        logger.info(`[Docs] Swagger UI available at http://localhost:${PORT}/api-docs`);
      });
    }
  } catch (error) {
    logger.error('[Server] Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
