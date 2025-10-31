import { Order, OrderId } from '../entities/order';
import { UserId } from '../entities/user';
import { OrderStatus } from '../value-objects/order-status';

export interface FindOrdersOptions {
  limit?: number;
  offset?: number;
  status?: OrderStatus;
  dateRange?: { start: Date; end: Date };
  userId?: UserId;
}

export interface CountOptions {
  status?: OrderStatus;
  userId?: UserId;
}

export interface IOrderRepository {
  // Queries
  findById(id: OrderId): Promise<Order | null>;
  findByUserId(userId: UserId, options: FindOrdersOptions): Promise<Order[]>;
  findAll(options: FindOrdersOptions): Promise<Order[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  updateStatus(id: OrderId, status: OrderStatus): Promise<void>;
}