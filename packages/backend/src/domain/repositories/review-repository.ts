import { Review, ReviewId } from '../entities/review';
import { UserId } from '../entities/user';
import { BookId } from '../entities/book';

export interface FindReviewsOptions {
  limit?: number;
  offset?: number;
  rating?: number;
  sortBy?: 'createdAt' | 'rating';
}

export interface CountOptions {
  bookId?: BookId;
  userId?: UserId;
  rating?: number;
}

export interface IReviewRepository {
  // Queries
  findById(id: ReviewId): Promise<Review | null>;
  findByBookId(bookId: BookId, options: FindReviewsOptions): Promise<Review[]>;
  findByUserId(userId: UserId, options: FindReviewsOptions): Promise<Review[]>;
  getAverageRating(bookId: BookId): Promise<number>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(review: Review): Promise<void>;
  update(review: Review): Promise<void>;
  delete(id: ReviewId): Promise<void>;
}