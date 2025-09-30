// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voting SaaS API',
      version: '1.0.0',
      description: 'Secure, multi-context online voting platform',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/modules/**/*.js'], // Path to your route files
};

module.exports = swaggerJsdoc(options);