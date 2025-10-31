import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { authenticate, authorize } from '../../infrastructure/http/middlewares';
import { UserRole } from '../../domain/value-objects/user-role';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // Public routes
  router.post('/register', userController.createUser.bind(userController));

  // Authenticated user routes
  router.get('/me', authenticate, userController.getCurrentUser.bind(userController));
  router.put('/me', authenticate, userController.updateCurrentUser.bind(userController));
  router.put('/me/password', authenticate, userController.changePassword.bind(userController));

  // Admin only routes
  router.get('/', authenticate, authorize([UserRole.ADMIN]), userController.getUsers.bind(userController));
  router.get('/:id', authenticate, authorize([UserRole.ADMIN]), userController.getUser.bind(userController));
  router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), userController.deleteUser.bind(userController));

  return router;
}