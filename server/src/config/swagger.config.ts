import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hot Takes API',
      version: '1.0.0',
      description:
        'RESTful API for Hot Takes application - Express.js backend with TypeScript',
      //   contact: {
      //     name: 'API Support',
      //     email: 'support@hottakes.com',
      //   },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
      server: [
        {
          url: process.env.API_SERVER_URL || 'http://localhost:5000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description:
              'JWT authentication token. Get token from /api/v1/auth/signin',
          },
        },
      },
      tags: [
        {
          name: 'Authentication',
          description: 'User authentication and authorization operations',
        },
        {
          name: 'Users',
          description: 'User management operations (Admin only)',
        },
        {
          name: 'Roles',
          description: 'Role management operations',
        },
        {
          name: 'Takes',
          description: 'Take content operations',
        },
        {
          name: 'Favorites',
          description: 'Favorite takes operations',
        },
      ],
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/types/*.ts',
    './src/config/swagger-schemas.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  if (
    process.env.NODE_ENV !== 'test' ||
    process.env.SWAGGER_ENABLED === 'true'
  ) {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Hot Takes API Documentation',
      }),
    );
  }
};

export default setupSwagger;
