import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { logger } from './infrastructure/logging/logger';
import { prisma } from './infrastructure/database/prisma-client';
import { JWTService } from './infrastructure/auth/jwt-service';
import { redisClient } from './infrastructure/cache/redis-client';
import {
  BookRepositoryPrisma,
  UserRepositoryPrisma,
  CategoryRepositoryPrisma,
  OrderRepositoryPrisma,
  CartRepositoryPrisma,
  ReviewRepositoryPrisma
} from './infrastructure/database';
import {
  NotificationService,
  PaymentService,
  PricingService
} from './application/services';
import {
  CreateBookUseCase,
  UpdateBookUseCase,
  DeleteBookUseCase,
  UpdateBookStockUseCase,
  GetBookUseCase,
  GetBooksUseCase,
  SearchBooksUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  GetUsersUseCase,
  ChangePasswordUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  GetCategoriesUseCase,
  CreateOrderUseCase,
  UpdateOrderStatusUseCase,
  GetOrderUseCase,
  GetOrdersUseCase,
  GetUserOrdersUseCase,
  CreateCartUseCase,
  UpdateCartUseCase,
  DeleteCartUseCase,
  GetCartUseCase,
  AddItemToCartUseCase,
  RemoveItemFromCartUseCase,
  ClearCartUseCase,
  CreateReviewUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  GetReviewUseCase,
  GetBookReviewsUseCase,
  GetUserReviewsUseCase,
  LoginUseCase,
  ValidateTokenUseCase,
  RefreshTokenUseCase
} from './application/use-cases';
import {
  BookController,
  UserController,
  CategoryController,
  OrderController,
  CartController,
  ReviewController,
  AuthController
} from './presentation/controllers';
import {
  createBookRoutes,
  createUserRoutes,
  createCategoryRoutes,
  createOrderRoutes,
  createCartRoutes,
  createReviewRoutes,
  createAuthRoutes
} from './presentation/routes';
import {
  requestLogger,
  errorHandler,
  corsHandler,
  rateLimit,
  createRateLimitMiddleware,
  createCsrfProtection,
  sanitizeInput,
  securityHeaders,
  requestSizeLimit
} from './infrastructure/http/middlewares';

async function bootstrap() {
  try {
    // Initialize database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Initialize Redis connection
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Initialize infrastructure services
    const jwtService = new JWTService();

    // Initialize repositories
    const bookRepository = new BookRepositoryPrisma(prisma);
    const userRepository = new UserRepositoryPrisma(prisma);
    const categoryRepository = new CategoryRepositoryPrisma(prisma);
    const orderRepository = new OrderRepositoryPrisma(prisma);
    const cartRepository = new CartRepositoryPrisma(prisma);
    const reviewRepository = new ReviewRepositoryPrisma(prisma);

    // Initialize application services
    const notificationService = new NotificationService();
    const paymentService = new PaymentService();
    const pricingService = new PricingService();

    // Initialize use cases
    // Book use cases
    const createBookUseCase = new CreateBookUseCase(bookRepository, categoryRepository);
    const updateBookUseCase = new UpdateBookUseCase(bookRepository, categoryRepository);
    const deleteBookUseCase = new DeleteBookUseCase(bookRepository);
    const updateBookStockUseCase = new UpdateBookStockUseCase(bookRepository);
    const getBookUseCase = new GetBookUseCase(bookRepository);
    const getBooksUseCase = new GetBooksUseCase(bookRepository);
    const searchBooksUseCase = new SearchBooksUseCase(bookRepository);

    // User use cases
    const createUserUseCase = new CreateUserUseCase(userRepository, jwtService);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);
    const getUserUseCase = new GetUserUseCase(userRepository);
    const getUsersUseCase = new GetUsersUseCase(userRepository);
    const changePasswordUseCase = new ChangePasswordUseCase(userRepository, jwtService);

    // Category use cases
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
    const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
    const getCategoryUseCase = new GetCategoryUseCase(categoryRepository);
    const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);

    // Order use cases
    const createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      cartRepository,
      bookRepository,
      userRepository,
      paymentService,
      notificationService,
      pricingService
    );
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository, notificationService);
    const getOrderUseCase = new GetOrderUseCase(orderRepository);
    const getOrdersUseCase = new GetOrdersUseCase(orderRepository);
    const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);

    // Cart use cases
    const createCartUseCase = new CreateCartUseCase(cartRepository, userRepository);
    const updateCartUseCase = new UpdateCartUseCase(cartRepository);
    const deleteCartUseCase = new DeleteCartUseCase(cartRepository);
    const getCartUseCase = new GetCartUseCase(cartRepository);
    const addItemToCartUseCase = new AddItemToCartUseCase(cartRepository, bookRepository, pricingService);
    const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(cartRepository);
    const clearCartUseCase = new ClearCartUseCase(cartRepository);

    // Review use cases
    const createReviewUseCase = new CreateReviewUseCase(reviewRepository, bookRepository, userRepository, orderRepository);
    const updateReviewUseCase = new UpdateReviewUseCase(reviewRepository);
    const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepository);
    const getReviewUseCase = new GetReviewUseCase(reviewRepository);
    const getBookReviewsUseCase = new GetBookReviewsUseCase(reviewRepository);
    const getUserReviewsUseCase = new GetUserReviewsUseCase(reviewRepository);

    // Auth use cases
    const loginUseCase = new LoginUseCase(userRepository, jwtService);
    const validateTokenUseCase = new ValidateTokenUseCase(jwtService);
    const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, jwtService);

    // Initialize controllers
    const bookController = new BookController(
      createBookUseCase,
      updateBookUseCase,
      deleteBookUseCase,
      updateBookStockUseCase,
      getBookUseCase,
      getBooksUseCase,
      searchBooksUseCase
    );

    const userController = new UserController(
      createUserUseCase,
      updateUserUseCase,
      deleteUserUseCase,
      getUserUseCase,
      getUsersUseCase,
      changePasswordUseCase
    );

    const categoryController = new CategoryController(
      createCategoryUseCase,
      updateCategoryUseCase,
      deleteCategoryUseCase,
      getCategoryUseCase,
      getCategoriesUseCase
    );

    const orderController = new OrderController(
      createOrderUseCase,
      updateOrderStatusUseCase,
      getOrderUseCase,
      getOrdersUseCase,
      getUserOrdersUseCase
    );

    const cartController = new CartController(
      createCartUseCase,
      updateCartUseCase,
      deleteCartUseCase,
      getCartUseCase,
      addItemToCartUseCase,
      removeItemFromCartUseCase,
      clearCartUseCase
    );

    const reviewController = new ReviewController(
      createReviewUseCase,
      updateReviewUseCase,
      deleteReviewUseCase,
      getReviewUseCase,
      getBookReviewsUseCase,
      getUserReviewsUseCase
    );

    const authController = new AuthController(
      loginUseCase,
      validateTokenUseCase,
      refreshTokenUseCase
    );

    // Initialize Express app
    const app = express();

    // Compression middleware
    app.use(compression({
      level: 6, // Balanced compression level
      threshold: 1024, // Only compress responses larger than 1KB
      filter: (req, res) => {
        // Don't compress responses with this request header
        if (req.headers['x-no-compression']) {
          return false;
        }
        // Use compression filter function
        return compression.filter(req, res);
      }
    }));

    // Security middlewares
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https:", "data:"],
          connectSrc: ["'self'"],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      permissionsPolicy: {
        features: {
          geolocation: [],
          microphone: [],
          camera: [],
          payment: [],
        },
      },
    }));

    // Additional security headers
    app.use(securityHeaders);

    // Request size limiting
    app.use(requestSizeLimit());

    // Input sanitization
    app.use(sanitizeInput());

    // CORS middleware
    app.use(corsHandler);

    // Rate limiting
    const { generalLimiter, authLimiter } = createRateLimitMiddleware();
    app.use(generalLimiter);

    // Logging middleware
    app.use(requestLogger);

    // Body parsing middlewares
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'library-api'
      });
    });

    // CSRF protection for state-changing operations
    const csrfProtection = createCsrfProtection();

    // API routes with specific rate limiting
    app.use('/api/auth', authLimiter, createAuthRoutes(authController));
    app.use('/api/books', createBookRoutes(bookController));
    app.use('/api/users', createUserRoutes(userController));
    app.use('/api/categories', createCategoryRoutes(categoryController));
    app.use('/api/orders', csrfProtection, createOrderRoutes(orderController));
    app.use('/api/cart', csrfProtection, createCartRoutes(cartController));
    app.use('/api/reviews', csrfProtection, createReviewRoutes(reviewController));

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not found',
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await redisClient.disconnect();
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await redisClient.disconnect();
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server', { error });
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();