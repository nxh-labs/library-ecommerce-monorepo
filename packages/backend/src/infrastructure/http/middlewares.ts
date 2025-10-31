import { Request, Response, NextFunction } from 'express';
import { logger } from '../logging/logger';
import { JWTService } from '../auth/jwt-service';
import { ValidationError } from '../validation/validator';
import { UserId } from '../../domain/entities/user';
import { UserRoleValue, UserRole } from '../../domain/value-objects/user-role';
import expressRateLimit from 'express-rate-limit';
import { body, param, query, validationResult } from 'express-validator';
import csurf from "csurf";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: UserId;
    email: string;
    role: UserRoleValue;
  };
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  });

  next();
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors,
    });
  }

  if (error.message.includes('Invalid or expired')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
  }

  if (error.message.includes('not found')) {
    return res.status(404).json({
      error: 'Not found',
      message: error.message,
    });
  }

  if (error.message.includes('already exists') || error.message.includes('unique constraint')) {
    return res.status(409).json({
      error: 'Conflict',
      message: error.message,
    });
  }

 return  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
}

export function authenticate(jwtService: JWTService) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = jwtService.extractTokenFromHeader(req.headers.authorization);

      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No token provided',
        });
      }

      const payload = jwtService.verifyAccessToken(token);

      req.user = {
        id: new UserId(payload.userId),
        email: payload.email,
        role: new UserRoleValue(payload.role as UserRole),
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function authorize(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const hasPermission = allowedRoles.some(role =>
      req.user!.role.getValue() === role ||
      (role === UserRole.MANAGER && req.user!.role.isManager()) ||
      (role === UserRole.ADMIN && req.user!.role.isAdmin())
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    return next();
  };
}

export function corsHandler(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin as string) || process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}

export function rateLimit(maxRequests: number, windowMs: number) {
  return expressRateLimit({
    windowMs,
    max: maxRequests,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
  });
}

export function createRateLimitMiddleware() {
  // General API rate limit
  const generalLimiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Stricter rate limit for authentication endpoints
  const authLimiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
      error: 'Too many authentication attempts',
      message: 'Too many login attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  return { generalLimiter, authLimiter };
}

// CSRF Protection middleware
export function createCsrfProtection(): (req: Request, res: Response, next: NextFunction) => void {
  return csurf({
    cookie: {
      key: '_csrf',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    value: (req) => {
      return (req.body && req.body._csrf) ||
             (req.query && req.query._csrf) ||
             (req.headers['csrf-token'] as string) ||
             (req.headers['xsrf-token'] as string) ||
             (req.headers['x-csrf-token'] as string) ||
             (req.headers['x-xsrf-token'] as string);
    },
  });
}

// Input sanitization middleware
export function sanitizeInput() {
  return [
    body('*').trim().escape(),
    param('*').trim().escape(),
    query('*').trim().escape(),
  ];
}

// // Enhanced validation middleware
// export function validateRequest(validations: any[]) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     await Promise.all(validations.map(validation => validation.run(req)));

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         error: 'Validation failed',
//         details: errors.array(),
//       });
//     }

//     next();
//   };
// }

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), accelerometer=(), payment=()'
  );

  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
}

// Request size limiting middleware
export function requestSizeLimit() {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    // Limit request body to 10MB
    if (contentLength > 10 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Request too large',
        message: 'Request body exceeds maximum allowed size',
      });
    }

    return next();
  };
}