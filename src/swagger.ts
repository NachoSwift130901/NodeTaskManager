// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task manager API',
      version: '1.0.0',
      description: 'An API to handle task management'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['src/controllers/*.ts'], // aquí se buscan los comentarios
});
