import { IUnitOfWork } from '@/domain/repositories/unit-of-work';
import {
  IBookRepository,
  IUserRepository,
  IOrderRepository,
  IReviewRepository,
  ICategoryRepository,
  ICartRepository
} from '@/domain';
import { PrismaClient, Prisma } from '@prisma/client';
import { InternalServerError } from '@/domain/errors';
import { BookRepositoryPrisma } from './book-repository-prisma';
import { UserRepositoryPrisma } from './user-repository-prisma';
import { OrderRepositoryPrisma } from './order-repository-prisma';
import { ReviewRepositoryPrisma } from './review-repository-prisma';
import { CategoryRepositoryPrisma } from './category-repository-prisma';
import { CartRepositoryPrisma } from './cart-repository-prisma';


export class UnitOfWorkPrisma implements IUnitOfWork {
  constructor(protected readonly prisma: PrismaClient) {}

  /**
   * Exécute un bloc de code dans une transaction Prisma
   * La transaction est automatiquement commit si le code réussit
   * ou rollback si une erreur est levée
   */
  async executeInTransaction<T>(
    work: (uow: IUnitOfWork) => Promise<T>
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const transactionalUoW = new TransactionalUnitOfWork(tx);
          return await work(transactionalUoW);
        },
        {
          maxWait: 5000, // Temps d'attente max pour démarrer la transaction (5s)
          timeout: 30000, // Timeout de la transaction (30s)
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Niveau d'isolation
        }
      );
    } catch (error) {
      throw new InternalServerError('Transaction failed');
    }
  }

  // Ces méthodes retournent des repositories NON transactionnels
  // Utilisez-les uniquement en dehors des transactions
  getBookRepository(): IBookRepository {
    return new BookRepositoryPrisma(this.prisma);
  }

  getUserRepository(): IUserRepository {
    return new UserRepositoryPrisma(this.prisma);
  }

  getOrderRepository(): IOrderRepository {
    return new OrderRepositoryPrisma(this.prisma);
  }

  getReviewRepository(): IReviewRepository {
    return new ReviewRepositoryPrisma(this.prisma);
  }

  getCategoryRepository(): ICategoryRepository {
    return new CategoryRepositoryPrisma(this.prisma);
  }

  getCartRepository(): ICartRepository {
    return new CartRepositoryPrisma(this.prisma);
  }
}


/**
 * Classe interne pour gérer les repositories dans une transaction
 * Cette classe ne doit jamais être utilisée directement
 */
class TransactionalUnitOfWork implements IUnitOfWork {
  private readonly bookRepo: BookRepositoryPrisma;
  private readonly userRepo: UserRepositoryPrisma;
  private readonly orderRepo: OrderRepositoryPrisma;
  private readonly reviewRepo: ReviewRepositoryPrisma;
  private readonly categoryRepo: CategoryRepositoryPrisma;
  private readonly cartRepo: CartRepositoryPrisma;

  constructor(private readonly tx: Prisma.TransactionClient) {
    // Initialiser tous les repositories avec le client transactionnel
    this.bookRepo = new BookRepositoryPrisma(this.tx as PrismaClient);
    this.userRepo = new UserRepositoryPrisma(this.tx as PrismaClient);
    this.orderRepo = new OrderRepositoryPrisma(this.tx as PrismaClient);
    this.reviewRepo = new ReviewRepositoryPrisma(this.tx as PrismaClient);
    this.categoryRepo = new CategoryRepositoryPrisma(this.tx as PrismaClient);
    this.cartRepo = new CartRepositoryPrisma(this.tx as PrismaClient);
  }

  getBookRepository(): IBookRepository {
    return this.bookRepo;
  }

  getUserRepository(): IUserRepository {
    return this.userRepo;
  }

  getOrderRepository(): IOrderRepository {
    return this.orderRepo;
  }

  getReviewRepository(): IReviewRepository {
    return this.reviewRepo;
  }

  getCategoryRepository(): ICategoryRepository {
    return this.categoryRepo;
  }

  getCartRepository(): ICartRepository {
    return this.cartRepo;
  }

  /**
   * Cette méthode n'est pas supportée dans TransactionalUnitOfWork
   * car les transactions imbriquées ne sont pas nécessaires
   */
  async executeInTransaction<T>(
    work: (uow: IUnitOfWork) => Promise<T>
  ): Promise<T> {
    throw new Error(
      'Nested transactions are not supported. Use the outer UnitOfWork instance instead.'
    );
  }
}