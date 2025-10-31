import { Review } from '../../domain/entities/review';
import { ReviewResponseDto, BookRatingDto } from '../../application/dto/review-dto';

export class ReviewMapper {
  static toResponseDto(review: Review): ReviewResponseDto {
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

  static toResponseDtoList(reviews: Review[]): ReviewResponseDto[] {
    return reviews.map(review => this.toResponseDto(review));
  }

  static toBookRatingDto(bookId: string, averageRating: number, totalReviews: number): BookRatingDto {
    return {
      bookId,
      averageRating,
      totalReviews
    };
  }
}