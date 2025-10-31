import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library E-commerce API',
      version: '1.0.0',
      description: 'API pour une plateforme de commerce électronique de bibliothèque avec gestion des livres, utilisateurs, commandes et paniers.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            lastLoginAt: { type: 'string', format: 'date-time' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            title: { type: 'string', example: 'Le Petit Prince' },
            isbn: { type: 'string', example: '978-2-07-040850-4' },
            author: { type: 'string', example: 'Antoine de Saint-Exupéry' },
            description: { type: 'string', example: 'Un conte philosophique...' },
            price: { type: 'number', format: 'float', example: 15.99 },
            stockQuantity: { type: 'integer', example: 100 },
            publisher: { type: 'string', example: 'Gallimard' },
            publicationDate: { type: 'string', format: 'date', example: '1943-04-06' },
            language: { type: 'string', example: 'fr' },
            pageCount: { type: 'integer', example: 96 },
            coverImageUrl: { type: 'string', format: 'uri', example: 'https://example.com/cover.jpg' },
            categoryId: { type: 'string', example: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            name: { type: 'string', example: 'Fiction' },
            description: { type: 'string', example: 'Livres de fiction' },
            parentId: { type: 'string', example: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            userId: { type: 'string', example: 'uuid' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], example: 'PENDING' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  bookId: { type: 'string', example: 'uuid' },
                  quantity: { type: 'integer', example: 2 },
                  unitPrice: { type: 'number', format: 'float', example: 15.99 },
                  totalPrice: { type: 'number', format: 'float', example: 31.98 },
                },
              },
            },
            shippingAddress: { type: 'string', example: '123 Rue de la Paix, Paris' },
            billingAddress: { type: 'string', example: '123 Rue de la Paix, Paris' },
            totalAmount: { type: 'number', format: 'float', example: 31.98 },
            orderDate: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            userId: { type: 'string', example: 'uuid' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'uuid' },
                  bookId: { type: 'string', example: 'uuid' },
                  quantity: { type: 'integer', example: 2 },
                  addedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            totalItems: { type: 'integer', example: 3 },
            estimatedTotalPrice: { type: 'number', format: 'float', example: 47.97 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            userId: { type: 'string', example: 'uuid' },
            bookId: { type: 'string', example: 'uuid' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            comment: { type: 'string', example: 'Excellent livre !' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation Error' },
            message: { type: 'string', example: 'Détails de l\'erreur' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/presentation/routes/*.ts'], // Chemins vers les fichiers contenant les annotations Swagger
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };