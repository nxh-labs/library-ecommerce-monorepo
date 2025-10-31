import { Router } from 'express';
import { CategoryController } from '../controllers/category-controller';
import { authenticate, authorize } from '../../infrastructure/http/middlewares';
import { UserRole } from '../../domain/value-objects/user-role';

export function createCategoryRoutes(categoryController: CategoryController): Router {
  const router = Router();

  // Public routes
  router.get('/', categoryController.getCategories.bind(categoryController));
  router.get('/hierarchy', categoryController.getCategoryHierarchy.bind(categoryController));
  router.get('/:id', categoryController.getCategory.bind(categoryController));

  // Admin only routes
  router.post('/', authenticate, authorize([UserRole.ADMIN]), categoryController.createCategory.bind(categoryController));
  router.put('/:id', authenticate, authorize([UserRole.ADMIN]), categoryController.updateCategory.bind(categoryController));
  router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), categoryController.deleteCategory.bind(categoryController));

  return router;
}