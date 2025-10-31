import { AddToCartUseCase, UpdateCartItemUseCase, RemoveFromCartUseCase, ClearCartUseCase, GetCartUseCase, GetCartSummaryUseCase, AddToCartDto, UpdateCartItemDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class CartController {
  constructor(
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeFromCartUseCase: RemoveFromCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly getCartSummaryUseCase: GetCartSummaryUseCase
  ) {}

  async addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: AddToCartDto = req.body;
      const cart = await this.addToCartUseCase.execute(userId, dto);
      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const { itemId } = req.params;
      if (!itemId) {
        res.status(400).json({ error: 'Item ID is required' });
        return;
      }
      const dto: UpdateCartItemDto = req.body;
      const cart = await this.updateCartItemUseCase.execute(userId, itemId, dto);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const { bookId } = req.params;
      if (!bookId) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      const cart = await this.removeFromCartUseCase.execute(userId, bookId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      await this.clearCartUseCase.execute(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const cart = await this.getCartUseCase.execute(userId);
      if (!cart) {
        res.status(404).json({ error: 'Cart not found' });
        return;
      }
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async getCartSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const summary = await this.getCartSummaryUseCase.execute(userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}