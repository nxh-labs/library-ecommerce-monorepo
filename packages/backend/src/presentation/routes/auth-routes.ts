import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { authenticate } from '../../infrastructure/http/middlewares';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/login', authController.login.bind(authController));
  router.post('/refresh', authController.refreshToken.bind(authController));
  router.post('/validate', authenticate, authController.validateToken.bind(authController));
  router.post('/logout', authenticate, authController.logout.bind(authController));

  return router;
}