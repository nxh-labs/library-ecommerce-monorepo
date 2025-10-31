import { IReviewRepository, ReviewId, BookId, FindReviewsOptions, UserId, Review } from '@/domain';
import { CountOptions } from '@/domain/repositories/review-repository';
import { PrismaClient } from '@prisma/client';

export class ReviewRepositoryPrisma implements IReviewRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: ReviewId): Promise<Review | null> {
    const reviewData = await this.prisma.review.findUnique({
      where: { id: id.getValue() },
    });

    if (!reviewData) return null;

    return this.mapToDomain(reviewData);
  }

  async findByBookId(bookId: BookId, options: FindReviewsOptions): Promise<Review[]> {
    const where: any = { bookId: bookId.getValue() };

    if (options.rating) {
      where.rating = options.rating;
    }

    const orderBy: any = {};
    if (options.sortBy) {
      orderBy[options.sortBy] = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const query: any = {
      where,
      include: {
        user: true, // Include user details to avoid N+1 queries
        book: true, // Include book details if needed
      },
      orderBy,
    };

    if (options.offset !== undefined) {
      query.skip = options.offset;
    }

    if (options.limit !== undefined) {
      query.take = options.limit;
    }

    const reviewsData = await this.prisma.review.findMany(query);

    return reviewsData.map(reviewData => this.mapToDomain(reviewData));
  }

  async findByUserId(userId: UserId, options: FindReviewsOptions): Promise<Review[]> {
    const where: any = { userId: userId.getValue() };

    if (options.rating) {
      where.rating = options.rating;
    }

    const orderBy: any = {};
    if (options.sortBy) {
      orderBy[options.sortBy] = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const query: any = {
      where,
      include: {
        book: true, // Include book details to avoid N+1 queries
        user: true, // Include user details if needed
      },
      orderBy,
    };

    if (options.offset !== undefined) {
      query.skip = options.offset;
    }

    if (options.limit !== undefined) {
      query.take = options.limit;
    }

    const reviewsData = await this.prisma.review.findMany(query);

    return reviewsData.map(reviewData => this.mapToDomain(reviewData));
  }

  async getAverageRating(bookId: BookId): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { bookId: bookId.getValue() },
      _avg: { rating: true },
    });

    return result._avg.rating || 0;
  }

  async count(options: CountOptions): Promise<number> {
    const where: any = {};

    if (options.bookId) {
      where.bookId = options.bookId.getValue();
    }

    if (options.userId) {
      where.userId = options.userId.getValue();
    }

    if (options.rating) {
      where.rating = options.rating;
    }

    return await this.prisma.review.count({ where });
  }

  async save(review: Review): Promise<void> {
    const data = this.mapToPrisma(review);

    await this.prisma.review.upsert({
      where: { id: review.getId().getValue() },
      update: data,
      create: data,
    });
  }

  async update(review: Review): Promise<void> {
    const data = this.mapToPrisma(review);

    await this.prisma.review.update({
      where: { id: review.getId().getValue() },
      data,
    });
  }

  async delete(id: ReviewId): Promise<void> {
    await this.prisma.review.delete({
      where: { id: id.getValue() },
    });
  }

  private mapToDomain(reviewData: any): Review {
    return new Review(
      new ReviewId(reviewData.id),
      new UserId(reviewData.userId),
      new BookId(reviewData.bookId),
      reviewData.rating,
      reviewData.comment,
      reviewData.createdAt,
      reviewData.updatedAt
    );
  }

  private mapToPrisma(review: Review): any {
    return {
      id: review.getId().getValue(),
      userId: review.getUserId().getValue(),
      bookId: review.getBookId().getValue(),
      rating: review.getRating(),
      comment: review.getComment(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt(),
    };
  }
}