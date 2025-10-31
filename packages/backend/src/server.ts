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
  PricingService,
  StripePaymentStrategy
} from './application/services';
import { IUnitOfWork } from './domain/repositories/unit-of-work';
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
  GetUserOrdersUseCase,
  AddToCartUseCase,
  UpdateCartItemUseCase,
  RemoveFromCartUseCase,
  GetCartUseCase,
  ClearCartUseCase,
  CreateReviewUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  GetReviewUseCase,
  GetBookReviewsUseCase,
  GetUserReviewsUseCase,
  LoginUseCase,
  ValidateTokenUseCase,
  RefreshTokenUseCase,
  GetCategoryHierarchyUseCase,
  UpdateOrderAddressUseCase,
  GetCartSummaryUseCase,
  GetBookRatingUseCase
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
import { PasswordService } from './infrastructure/auth/password-service';

async function bootstrap() {
  try {
    // Initialize database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Initialize Redis connection
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Initialize infrastructure services
    let jwtService: JWTService;
    try {
      jwtService = new JWTService();
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de JWTService', { error });
      throw error;
    }
    let passwordService: PasswordService
    try {
      passwordService = new PasswordService();
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de PasswordService', { error });
      throw error;
    }

    // Initialize unit of work (placeholder - would need proper implementation)
    let unitOfWork: IUnitOfWork;
    try {
      // TODO: Implement proper UnitOfWork
      unitOfWork = {} as IUnitOfWork;
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UnitOfWork', { error });
      throw error;
    }

    // Initialize repositories
    let bookRepository: BookRepositoryPrisma;
    try {
      bookRepository = new BookRepositoryPrisma(prisma);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de BookRepositoryPrisma', { error });
      throw error;
    }

    let userRepository: UserRepositoryPrisma;
    try {
      userRepository = new UserRepositoryPrisma(prisma);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UserRepositoryPrisma', { error });
      throw error;
    }

    let categoryRepository: CategoryRepositoryPrisma;
    try {
      categoryRepository = new CategoryRepositoryPrisma(prisma);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CategoryRepositoryPrisma', { error });
      throw error;
    }

    let orderRepository: OrderRepositoryPrisma;
    try {
      orderRepository = new OrderRepositoryPrisma(prisma);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de OrderRepositoryPrisma', { error });
      throw error;
    }

    let cartRepository: CartRepositoryPrisma;
    try {
      cartRepository = new CartRepositoryPrisma(prisma);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CartRepositoryPrisma', { error });
      throw error;
    }

    let reviewRepository: ReviewRepositoryPrisma;
    try {
      reviewRepository = new ReviewRepositoryPrisma(prisma);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de ReviewRepositoryPrisma', { error });
      throw error;
    }

    // Initialize application services
    let notificationService: NotificationService;
    try {
      notificationService = new NotificationService();
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de NotificationService', { error });
      throw error;
    }

    let paymentService: PaymentService;
    try {
      paymentService = new PaymentService(new StripePaymentStrategy());
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de PaymentService', { error });
      throw error;
    }

    let pricingService: PricingService;
    try {
      pricingService = new PricingService();
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de PricingService', { error });
      throw error;
    }

    // Initialize use cases
    // Book use cases
    let createBookUseCase: CreateBookUseCase;
    try {
      createBookUseCase = new CreateBookUseCase(bookRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CreateBookUseCase', { error });
      throw error;
    }

    let updateBookUseCase: UpdateBookUseCase;
    try {
      updateBookUseCase = new UpdateBookUseCase(bookRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateBookUseCase', { error });
      throw error;
    }

    let deleteBookUseCase: DeleteBookUseCase;
    try {
      deleteBookUseCase = new DeleteBookUseCase(bookRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de DeleteBookUseCase', { error });
      throw error;
    }

    let updateBookStockUseCase: UpdateBookStockUseCase;
    try {
      updateBookStockUseCase = new UpdateBookStockUseCase(bookRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateBookStockUseCase', { error });
      throw error;
    }

    let getBookUseCase: GetBookUseCase;
    try {
      getBookUseCase = new GetBookUseCase(bookRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetBookUseCase', { error });
      throw error;
    }

    let getBooksUseCase: GetBooksUseCase;
    try {
      getBooksUseCase = new GetBooksUseCase(bookRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetBooksUseCase', { error });
      throw error;
    }

    let searchBooksUseCase: SearchBooksUseCase;
    try {
      searchBooksUseCase = new SearchBooksUseCase(bookRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de SearchBooksUseCase', { error });
      throw error;
    }

    // User use cases
    let createUserUseCase: CreateUserUseCase;
    try {
      createUserUseCase = new CreateUserUseCase(userRepository, unitOfWork, passwordService);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CreateUserUseCase', { error });
      throw error;
    }

    let updateUserUseCase: UpdateUserUseCase;
    try {
      updateUserUseCase = new UpdateUserUseCase(userRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateUserUseCase', { error });
      throw error;
    }

    let deleteUserUseCase: DeleteUserUseCase;
    try {
      deleteUserUseCase = new DeleteUserUseCase(userRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de DeleteUserUseCase', { error });
      throw error;
    }

    let getUserUseCase: GetUserUseCase;
    try {
      getUserUseCase = new GetUserUseCase(userRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetUserUseCase', { error });
      throw error;
    }

    let getUsersUseCase: GetUsersUseCase;
    try {
      getUsersUseCase = new GetUsersUseCase(userRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetUsersUseCase', { error });
      throw error;
    }

    let changePasswordUseCase: ChangePasswordUseCase;
    try {
      changePasswordUseCase = new ChangePasswordUseCase(userRepository, unitOfWork, passwordService);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de ChangePasswordUseCase', { error });
      throw error;
    }

    // Category use cases
    let createCategoryUseCase: CreateCategoryUseCase;
    try {
      createCategoryUseCase = new CreateCategoryUseCase(categoryRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CreateCategoryUseCase', { error });
      throw error;
    }

    let updateCategoryUseCase: UpdateCategoryUseCase;
    try {
      updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateCategoryUseCase', { error });
      throw error;
    }

    let deleteCategoryUseCase: DeleteCategoryUseCase;
    try {
      deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de DeleteCategoryUseCase', { error });
      throw error;
    }

    let getCategoryUseCase: GetCategoryUseCase;
    try {
      getCategoryUseCase = new GetCategoryUseCase(categoryRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetCategoryUseCase', { error });
      throw error;
    }
    let getCategoryHierarchyUseCase: GetCategoryHierarchyUseCase
    try {
      getCategoryHierarchyUseCase = new GetCategoryHierarchyUseCase(categoryRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetCategoryHierarchyUseCase', { error });
      throw error;
    }
    let getCategoriesUseCase: GetCategoriesUseCase;
    try {
      getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetCategoriesUseCase', { error });
      throw error;
    }

    // Order use cases
    let createOrderUseCase: CreateOrderUseCase;
    try {
      createOrderUseCase = new CreateOrderUseCase(
        orderRepository,
        bookRepository,
        cartRepository,
        unitOfWork,
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CreateOrderUseCase', { error });
      throw error;
    }

    let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
    try {
      updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateOrderStatusUseCase', { error });
      throw error;
    }
    let updateOrderAddressUseCase: UpdateOrderAddressUseCase;
    try {
      updateOrderAddressUseCase = new UpdateOrderAddressUseCase(orderRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateOrderAddressUseCase', { error });
      throw error;
    }
    let getOrderUseCase: GetOrderUseCase;
    try {
      getOrderUseCase = new GetOrderUseCase(orderRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetOrderUseCase', { error });
      throw error;
    }

    let getOrdersUseCase: GetOrderUseCase;
    try {
      getOrdersUseCase = new GetOrderUseCase(orderRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetOrderUseCase', { error });
      throw error;
    }

    let getUserOrdersUseCase: GetUserOrdersUseCase;
    try {
      getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetUserOrdersUseCase', { error });
      throw error;
    }

    // Cart use cases
    let addToCartUseCase: AddToCartUseCase;
    try {
      addToCartUseCase = new AddToCartUseCase(cartRepository, bookRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de AddToCartUseCase', { error });
      throw error;
    }

    let updateCartItemUseCase: UpdateCartItemUseCase;
    try {
      updateCartItemUseCase = new UpdateCartItemUseCase(cartRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateCartItemUseCase', { error });
      throw error;
    }

    let removeFromCartUseCase: RemoveFromCartUseCase;
    try {
      removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de RemoveFromCartUseCase', { error });
      throw error;
    }

    let getCartUseCase: GetCartUseCase;
    try {
      getCartUseCase = new GetCartUseCase(cartRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetCartUseCase', { error });
      throw error;
    }
    let getCartSummaryUseCase: GetCartSummaryUseCase;
    try {
      getCartSummaryUseCase = new GetCartSummaryUseCase(cartRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetCartSummaryUseCase', { error });
      throw error;
    }
    let clearCartUseCase: ClearCartUseCase;
    try {
      clearCartUseCase = new ClearCartUseCase(cartRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de ClearCartUseCase', { error });
      throw error;
    }

    // Review use cases
    let createReviewUseCase: CreateReviewUseCase;
    try {
      createReviewUseCase = new CreateReviewUseCase(reviewRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CreateReviewUseCase', { error });
      throw error;
    }

    let updateReviewUseCase: UpdateReviewUseCase;
    try {
      updateReviewUseCase = new UpdateReviewUseCase(reviewRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UpdateReviewUseCase', { error });
      throw error;
    }

    let deleteReviewUseCase: DeleteReviewUseCase;
    try {
      deleteReviewUseCase = new DeleteReviewUseCase(reviewRepository, unitOfWork);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de DeleteReviewUseCase', { error });
      throw error;
    }

    let getReviewUseCase: GetReviewUseCase;
    try {
      getReviewUseCase = new GetReviewUseCase(reviewRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetReviewUseCase', { error });
      throw error;
    }

    let getBookReviewsUseCase: GetBookReviewsUseCase;
    try {
      getBookReviewsUseCase = new GetBookReviewsUseCase(reviewRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetBookReviewsUseCase', { error });
      throw error;
    }
    let getBookRatingUseCase: GetBookRatingUseCase;
    try {
      getBookRatingUseCase = new GetBookRatingUseCase(reviewRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetBookRatingUseCase', { error });
      throw error;
    }

    let getUserReviewsUseCase: GetUserReviewsUseCase;
    try {
      getUserReviewsUseCase = new GetUserReviewsUseCase(reviewRepository);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de GetUserReviewsUseCase', { error });
      throw error;
    }

    // Auth use cases
    let loginUseCase: LoginUseCase;
    try {
      loginUseCase = new LoginUseCase(userRepository, jwtService, passwordService);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de LoginUseCase', { error });
      throw error;
    }

    let validateTokenUseCase: ValidateTokenUseCase;
    try {
      validateTokenUseCase = new ValidateTokenUseCase(userRepository, jwtService);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de ValidateTokenUseCase', { error });
      throw error;
    }

    let refreshTokenUseCase: RefreshTokenUseCase;
    try {
      refreshTokenUseCase = new RefreshTokenUseCase(userRepository, jwtService);
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de RefreshTokenUseCase', { error });
      throw error;
    }

    // Initialize controllers
    let bookController: BookController;
    try {
      bookController = new BookController(
        createBookUseCase,
        updateBookUseCase,
        deleteBookUseCase,
        updateBookStockUseCase,
        getBookUseCase,
        getBooksUseCase,
        searchBooksUseCase
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de BookController', { error });
      throw error;
    }

    let userController: UserController;
    try {
      userController = new UserController(
        createUserUseCase,
        updateUserUseCase,
        deleteUserUseCase,
        changePasswordUseCase,
        getUserUseCase,
        getUsersUseCase,
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de UserController', { error });
      throw error;
    }

    let categoryController: CategoryController;
    try {
      categoryController = new CategoryController(
        createCategoryUseCase,
        updateCategoryUseCase,
        deleteCategoryUseCase,
        getCategoryUseCase,
        getCategoriesUseCase, getCategoryHierarchyUseCase
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CategoryController', { error });
      throw error;
    }

    let orderController: OrderController;
    try {
      orderController = new OrderController(
        createOrderUseCase,
        updateOrderStatusUseCase,
        updateOrderAddressUseCase,
        getOrderUseCase,
        getUserOrdersUseCase
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de OrderController', { error });
      throw error;
    }

    let cartController: CartController;
    try {
      cartController = new CartController(
        addToCartUseCase,
        updateCartItemUseCase,
        removeFromCartUseCase,
        clearCartUseCase,
        getCartUseCase,
        getCartSummaryUseCase
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de CartController', { error });
      throw error;
    }

    let reviewController: ReviewController;
    try {
      reviewController = new ReviewController(
        createReviewUseCase,
        updateReviewUseCase,
        deleteReviewUseCase,
        getReviewUseCase,
        getBookReviewsUseCase,
        getUserReviewsUseCase,
        getBookRatingUseCase
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de ReviewController', { error });
      throw error;
    }

    let authController: AuthController;
    try {
      authController = new AuthController(
        loginUseCase,
        validateTokenUseCase,
        refreshTokenUseCase
      );
    } catch (error) {
      logger.error('Erreur lors de l\'instanciation de AuthController', { error });
      throw error;
    }

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
      // permissionsPolicy: {
      //   features: {
      //     geolocation: [],
      //     microphone: [],
      //     camera: [],
      //     payment: [],
      //   },
      // },
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