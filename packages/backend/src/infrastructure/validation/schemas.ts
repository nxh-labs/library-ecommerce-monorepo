import { z } from 'zod';

// Custom sanitization functions
const sanitize = (str: string) => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

const sanitizeString = z.string();

const sanitizeEmail = z.string().email().transform((email) => {
  return email.toLowerCase().trim();
});

// User validation schemas
export const createUserSchema = z.object({
  email: sanitizeEmail,
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  firstName: sanitizeString.min(1, 'First name is required').max(100, 'First name too long').transform(sanitize),
  lastName: sanitizeString.min(1, 'Last name is required').max(100, 'Last name too long').transform(sanitize),
});

export const updateUserSchema = z.object({
  firstName: sanitizeString.min(1, 'First name is required').max(100, 'First name too long').transform(sanitize).optional(),
  lastName: sanitizeString.min(1, 'Last name is required').max(100, 'Last name too long').transform(sanitize).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: sanitizeEmail,
  password: z.string().min(1, 'Password is required'),
});

// Book validation schemas
export const createBookSchema = z.object({
  title: sanitizeString.min(1, 'Title is required').max(255, 'Title too long').transform(sanitize),
  isbn: z.string()
    .regex(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits')
    .transform((isbn) => isbn.replace(/[^\d]/g, '')), // Remove non-digits
  author: sanitizeString.min(1, 'Author is required').max(255, 'Author name too long').transform(sanitize),
  description: sanitizeString.max(2000, 'Description too long').transform(sanitize).optional(),
  price: z.number().positive('Price must be positive').max(10000, 'Price too high'),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').max(100000, 'Stock quantity too high'),
  publisher: sanitizeString.min(1, 'Publisher is required').max(255, 'Publisher name too long').transform(sanitize),
  publicationDate: z.string().datetime('Invalid publication date'),
  language: z.string().min(1, 'Language is required').max(50, 'Language too long'),
  pageCount: z.number().int().positive('Page count must be positive').max(10000, 'Page count too high'),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

export const updateBookSchema = z.object({
  title: sanitizeString.min(1, 'Title is required').max(255, 'Title too long').transform(sanitize).optional(),
  author: sanitizeString.min(1, 'Author is required').max(255, 'Author name too long').transform(sanitize).optional(),
  description: sanitizeString.max(2000, 'Description too long').transform(sanitize).optional(),
  price: z.number().positive('Price must be positive').max(10000, 'Price too high').optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').max(100000, 'Stock quantity too high').optional(),
  publisher: sanitizeString.min(1, 'Publisher is required').max(255, 'Publisher name too long').transform(sanitize).optional(),
  language: z.string().min(1, 'Language is required').max(50, 'Language too long').optional(),
  pageCount: z.number().int().positive('Page count must be positive').max(10000, 'Page count too high').optional(),
  categoryId: z.string().uuid('Invalid category ID').nullable().optional(),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: sanitizeString.min(1, 'Name is required').max(100, 'Name too long').transform(sanitize),
  description: sanitizeString.max(500, 'Description too long').transform(sanitize).optional(),
  parentId: z.string().uuid('Invalid parent category ID').nullable().optional(),
});

export const updateCategorySchema = z.object({
  name: sanitizeString.min(1, 'Name is required').max(100, 'Name too long').transform(sanitize).optional(),
  description: sanitizeString.max(500, 'Description too long').transform(sanitize).optional(),
  parentId: z.string().uuid('Invalid parent category ID').nullable().optional(),
});

// Order validation schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    bookId: z.string().uuid('Invalid book ID'),
    quantity: z.number().int().positive('Quantity must be positive').max(100, 'Quantity too high'),
  })).min(1, 'Order must contain at least one item').max(50, 'Too many items in order'),
  shippingAddress: sanitizeString.min(1, 'Shipping address is required').max(500, 'Address too long').transform(sanitize),
  billingAddress: sanitizeString.min(1, 'Billing address is required').max(500, 'Address too long').transform(sanitize),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});

// Cart validation schemas
export const addToCartSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

// Review validation schemas
export const createReviewSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: sanitizeString.min(1, 'Comment is required').max(1000, 'Comment too long').transform(sanitize),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  comment: sanitizeString.min(1, 'Comment is required').max(1000, 'Comment too long').transform(sanitize).optional(),
});

// Query parameter validation schemas
export const paginationSchema = z.object({
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional(),
  offset: z.string().transform(val => parseInt(val)).refine(val => val >= 0, 'Offset must be non-negative').optional(),
});

export const bookSearchSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  priceMin: z.string().transform(val => parseFloat(val)).refine(val => val >= 0, 'Minimum price must be non-negative').optional(),
  priceMax: z.string().transform(val => parseFloat(val)).refine(val => val >= 0, 'Maximum price must be non-negative').optional(),
  inStock: z.string().transform(val => val === 'true').optional(),
  sortBy: z.enum(['title', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const userSearchSchema = z.object({
  role: z.enum(['CUSTOMER', 'MANAGER', 'ADMIN']).optional(),
  search: z.string().optional(),
});

export const orderSearchSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  dateFrom: z.string().datetime('Invalid date format').optional(),
  dateTo: z.string().datetime('Invalid date format').optional(),
});

export const reviewSearchSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['createdAt', 'rating']).optional(),
});