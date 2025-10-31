import { CreateOrderUseCase, UpdateOrderStatusUseCase, UpdateOrderAddressUseCase, GetOrderUseCase, GetUserOrdersUseCase, CreateOrderDto, OrderSearchDto, UpdateOrderStatusDto, UpdateOrderAddressDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly updateOrderAddressUseCase: UpdateOrderAddressUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase
  ) {}

  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: CreateOrderDto = req.body;
      const order = await this.createOrderUseCase.execute(userId, dto);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Order ID is required' });
        return;
      }
      const order = await this.getOrderUseCase.execute(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: OrderSearchDto = req.query as any;
      const orders = await this.getUserOrdersUseCase.execute(userId, dto);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Order ID is required' });
        return;
      }
      const dto: UpdateOrderStatusDto = req.body;
      const order = await this.updateOrderStatusUseCase.execute(id, dto);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderAddress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Order ID is required' });
        return;
      }
      const dto: UpdateOrderAddressDto = req.body;
      const order = await this.updateOrderAddressUseCase.execute(id, dto);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
}