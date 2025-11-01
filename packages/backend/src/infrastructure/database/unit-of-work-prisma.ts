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
import { UserRepositoryPrisma } from './user-repository-prisma';
import { BookRepositoryPrisma } from './book-repository-prisma';
import { OrderRepositoryPrisma } from './order-repository-prisma';
import { ReviewRepositoryPrisma } from './review-repository-prisma';
import { CategoryRepositoryPrisma } from './category-repository-prisma';
import { CartRepositoryPrisma } from './cart-repository-prisma';

export class UnitOfWorkPrisma implements IUnitOfWork {
  private transactionPromise: Promise<void> | null = null;
  private transactionResolve: (() => void) | null = null;
  private transactionReject: ((reason: any) => void) | null = null;
  private bookRepo: BookRepositoryPrisma | null = null;
  private userRepo: UserRepositoryPrisma | null = null;
  private orderRepo: OrderRepositoryPrisma | null = null;
  private reviewRepo: ReviewRepositoryPrisma | null = null;
  private categoryRepo: CategoryRepositoryPrisma | null = null;
  private cartRepo: CartRepositoryPrisma | null = null;

  constructor(protected readonly prisma: PrismaClient) { }

  async beginTransaction(): Promise<void> {
    if (this.transactionPromise) {
      throw new Error('Transaction already started');
    }

    // Créer la transaction Prisma qui attendra le commit ou rollback
    this.transactionPromise = this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Initialiser tous les repositories avec le client transactionnel
        this.bookRepo = new BookRepositoryPrisma(tx as any);
        this.userRepo = new UserRepositoryPrisma(tx as any);
        console.log("user instantiation")
        this.orderRepo = new OrderRepositoryPrisma(tx as any);
        this.reviewRepo = new ReviewRepositoryPrisma(tx as any);
        this.categoryRepo = new CategoryRepositoryPrisma(tx as any);
        this.cartRepo = new CartRepositoryPrisma(tx as any);

        // Créer une promesse qui sera résolue par commit() ou rejetée par rollback()
        return new Promise<void>((resolve, reject) => {
          this.transactionResolve = resolve;
          this.transactionReject = reject;
        });
      },
      {
        maxWait: 5000, // Attendre maximum 5s pour démarrer la transaction
        timeout: 30000, // Timeout de 30s pour la transaction complète
      }
    );

    // Attendre que les repositories soient initialisés
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  async commit(): Promise<void> {
    if (!this.transactionResolve || !this.transactionPromise) {
      throw new Error('No transaction to commit');
    }

    try {
      // Résoudre la promesse pour valider la transaction
      this.transactionResolve();

      // Attendre que Prisma finalise la transaction
      await this.transactionPromise;

      // Nettoyer les ressources
      this.cleanup();
    } catch (error) {
      // En cas d'erreur, nettoyer et propager l'erreur
      this.cleanup();
      throw error;
    }
  }

  async rollback(): Promise<void> {
    if (!this.transactionReject || !this.transactionPromise) {
      throw new Error('No transaction to rollback');
    }

    try {
      // Rejeter la promesse pour annuler la transaction
      this.transactionReject(new Error('Transaction rolled back'));

      // Attendre que Prisma annule la transaction
      await this.transactionPromise;
    } catch (error) {
      // L'erreur est attendue car on a rejeté la transaction
      // On peut l'ignorer ou la logger
    } finally {
      // Toujours nettoyer les ressources
      this.cleanup();
    }
  }

  private cleanup(): void {
    this.transactionPromise = null;
    this.transactionResolve = null;
    this.transactionReject = null;
    this.bookRepo = null;
    this.userRepo = null;
    this.orderRepo = null;
    this.reviewRepo = null;
    this.categoryRepo = null;
    this.cartRepo = null;
  }

  getBookRepository(): IBookRepository {
    if (!this.bookRepo) {
      throw new Error('Transaction not started. Call beginTransaction() first.');
    }
    return this.bookRepo;
  }

  getUserRepository(): IUserRepository {
    if (!this.userRepo) {
      throw new Error('Transaction not started. Call beginTransaction() first.');
    }
    return this.userRepo;
  }

  getOrderRepository(): IOrderRepository {
    if (!this.orderRepo) {
      throw new Error('Transaction not started. Call beginTransaction() first.');
    }
    return this.orderRepo;
  }

  getReviewRepository(): IReviewRepository {
    if (!this.reviewRepo) {
      throw new Error('Transaction not started. Call beginTransaction() first.');
    }
    return this.reviewRepo;
  }

  getCategoryRepository(): ICategoryRepository {
    if (!this.categoryRepo) {
      throw new Error('Transaction not started. Call beginTransaction() first.');
    }
    return this.categoryRepo;
  }

  getCartRepository(): ICartRepository {
    if (!this.cartRepo) {
      throw new Error('Transaction not started. Call beginTransaction() first.');
    }
    return this.cartRepo;
  }
}