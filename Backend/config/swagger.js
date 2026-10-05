const swaggerJsdoc = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Finance Tracker SaaS API',
    version: '1.0.0',
    description: 'Enterprise AI-Powered Wealth & Personal Finance Tracking REST API'
  },
  servers: [
    {
      url: '/api',
      description: 'API Base Endpoint'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

module.exports = {
  swaggerUi: swaggerJsdoc,
  swaggerDocument
};
