import { IBookRepository } from './book-repository';
import { IUserRepository } from './user-repository';
import { IOrderRepository } from './order-repository';
import { IReviewRepository } from './review-repository';
import { ICategoryRepository } from './category-repository';
import { ICartRepository } from './cart-repository';

export interface IUnitOfWork {
  // Transaction management
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  // Repository access within transaction
  getBookRepository(): IBookRepository;
  getUserRepository(): IUserRepository;
  getOrderRepository(): IOrderRepository;
  getReviewRepository(): IReviewRepository;
  getCategoryRepository(): ICategoryRepository;
  getCartRepository(): ICartRepository;
}