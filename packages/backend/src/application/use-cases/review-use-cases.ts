import { IReviewRepository, IUnitOfWork, UserId, BookId, ReviewId, Review, FindReviewsOptions } from "@/domain";
import { CreateReviewDto, ReviewResponseDto, UpdateReviewDto, ReviewSearchDto, BookRatingDto } from "../dto";

// Commands
export class CreateReviewUseCase {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const userIdObj = new UserId(userId);
    const bookId = new BookId(dto.bookId);

    // Check if user already reviewed this book
    const existingReviews = await this.reviewRepository.findByUserId(userIdObj, { limit: 1000 });
    const hasReviewed = existingReviews.some(review => review.getBookId().equals(bookId));
    if (hasReviewed) {
      throw new Error('User has already reviewed this book');
    }

    const reviewId = new ReviewId(crypto.randomUUID());
    const review = new Review(
      reviewId,
      userIdObj,
      bookId,
      dto.rating,
      dto.comment
    );

    await this.unitOfWork.beginTransaction();
    try {
      await this.reviewRepository.save(review);
      await this.unitOfWork.commit();
      return this.mapToResponseDto(review);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.getId().getValue(),
      userId: review.getUserId().getValue(),
      bookId: review.getBookId().getValue(),
      rating: review.getRating(),
      comment: review.getComment(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt()
    };
  }
}

export class UpdateReviewUseCase {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, userId: string, dto: UpdateReviewDto): Promise<ReviewResponseDto> {
    const reviewId = new ReviewId(id);
    const userIdObj = new UserId(userId);

    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Check if user owns the review
    if (!review.getUserId().equals(userIdObj)) {
      throw new Error('Unauthorized to update this review');
    }

    if (dto.rating !== undefined) {
      review.updateRating(dto.rating);
    }
    if (dto.comment !== undefined) {
      review.updateComment(dto.comment);
    }

    await this.unitOfWork.beginTransaction();
    try {
      await this.reviewRepository.update(review);
      await this.unitOfWork.commit();
      return this.mapToResponseDto(review);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.getId().getValue(),
      userId: review.getUserId().getValue(),
      bookId: review.getBookId().getValue(),
      rating: review.getRating(),
      comment: review.getComment(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt()
    };
  }
}

export class DeleteReviewUseCase {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const reviewId = new ReviewId(id);
    const userIdObj = new UserId(userId);

    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Check if user owns the review
    if (!review.getUserId().equals(userIdObj)) {
      throw new Error('Unauthorized to delete this review');
    }

    await this.unitOfWork.beginTransaction();
    try {
      await this.reviewRepository.delete(reviewId);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}

// Queries
export class GetReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(id: string): Promise<ReviewResponseDto | null> {
    const reviewId = new ReviewId(id);
    const review = await this.reviewRepository.findById(reviewId);
    return review ? this.mapToResponseDto(review) : null;
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.getId().getValue(),
      userId: review.getUserId().getValue(),
      bookId: review.getBookId().getValue(),
      rating: review.getRating(),
      comment: review.getComment(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt()
    };
  }
}

export class GetBookReviewsUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(bookId: string, dto: ReviewSearchDto): Promise<ReviewResponseDto[]> {
    const bookIdObj = new BookId(bookId);
    const options = {
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      rating: dto.rating,
      sortBy: dto.sortBy || 'createdAt',
      sortOrder: dto.sortOrder || 'desc'
    };

    const reviews = await this.reviewRepository.findByBookId(bookIdObj, options as FindReviewsOptions);
    return reviews.map(review => this.mapToResponseDto(review));
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.getId().getValue(),
      userId: review.getUserId().getValue(),
      bookId: review.getBookId().getValue(),
      rating: review.getRating(),
      comment: review.getComment(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt()
    };
  }
}

export class GetUserReviewsUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(userId: string, dto: ReviewSearchDto): Promise<ReviewResponseDto[]> {
    const userIdObj = new UserId(userId);
    const options = {
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      rating: dto.rating,
      sortBy: dto.sortBy || 'createdAt',
      sortOrder: dto.sortOrder || 'desc'
    };

    const reviews = await this.reviewRepository.findByUserId(userIdObj, options as FindReviewsOptions);
    return reviews.map(review => this.mapToResponseDto(review));
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.getId().getValue(),
      userId: review.getUserId().getValue(),
      bookId: review.getBookId().getValue(),
      rating: review.getRating(),
      comment: review.getComment(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt()
    };
  }
}

export class GetBookRatingUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(bookId: string): Promise<BookRatingDto> {
    const bookIdObj = new BookId(bookId);
    const averageRating = await this.reviewRepository.getAverageRating(bookIdObj);
    const totalReviews = await this.reviewRepository.count({ bookId: bookIdObj });

    return {
      bookId,
      averageRating,
      totalReviews
    };
  }
}