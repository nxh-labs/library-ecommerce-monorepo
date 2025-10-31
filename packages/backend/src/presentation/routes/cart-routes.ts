import { Router } from 'express';
import { CartController } from '../controllers/cart-controller';
import { authenticate } from '../../infrastructure/http/middlewares';

export function createCartRoutes(cartController: CartController): Router {
  const router = Router();

  // All cart routes require authentication
  router.use(authenticate);

  router.get('/', cartController.getCart.bind(cartController));
  router.get('/summary', cartController.getCartSummary.bind(cartController));
  router.post('/items', cartController.addToCart.bind(cartController));
  router.put('/items/:itemId', cartController.updateCartItem.bind(cartController));
  router.delete('/items/:bookId', cartController.removeFromCart.bind(cartController));
  router.delete('/', cartController.clearCart.bind(cartController));

  return router;
}