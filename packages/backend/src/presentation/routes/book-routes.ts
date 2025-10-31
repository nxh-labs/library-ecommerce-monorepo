import { Router } from 'express';
import { BookController } from '../controllers/book-controller';
import { authenticate, authorize } from '../../infrastructure/http/middlewares';
import { UserRole } from '../../domain/value-objects/user-role';

export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  // Public routes
  router.get('/', bookController.getBooks.bind(bookController));
  router.get('/search', bookController.searchBooks.bind(bookController));
  router.get('/:id', bookController.getBook.bind(bookController));

  // Admin only routes
  router.post('/', authenticate, authorize([UserRole.ADMIN]), bookController.createBook.bind(bookController));
  router.put('/:id', authenticate, authorize([UserRole.ADMIN]), bookController.updateBook.bind(bookController));
  router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), bookController.deleteBook.bind(bookController));
  router.patch('/:id/stock', authenticate, authorize([UserRole.ADMIN]), bookController.updateStock.bind(bookController));

  return router;
}