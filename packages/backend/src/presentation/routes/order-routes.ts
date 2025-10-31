import { Router } from 'express';
import { OrderController } from '../controllers/order-controller';
import { authenticate, authorize } from '../../infrastructure/http/middlewares';
import { UserRole } from '../../domain/value-objects/user-role';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  // All order routes require authentication
  router.use(authenticate);

  // User routes
  router.post('/', orderController.createOrder.bind(orderController));
  router.get('/', orderController.getUserOrders.bind(orderController));
  router.get('/:id', orderController.getOrder.bind(orderController));
  router.put('/:id/address', orderController.updateOrderAddress.bind(orderController));

  // Admin routes
  router.put('/:id/status', authorize([UserRole.ADMIN]), orderController.updateOrderStatus.bind(orderController));

  return router;
}