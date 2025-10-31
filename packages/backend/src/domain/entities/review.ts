import { UserId } from './user';
import { BookId } from './book';

export class ReviewId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Review ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ReviewId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class Review {
  private readonly id: ReviewId;
  private readonly userId: UserId;
  private readonly bookId: BookId;
  private rating: number;
  private comment: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: ReviewId,
    userId: UserId,
    bookId: BookId,
    rating: number,
    comment: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateRating(rating);
    this.validateComment(comment);

    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validateRating(rating: number): void {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
  }

  private validateComment(comment: string): void {
    if (!comment || comment.trim().length === 0) {
      throw new Error('Review comment cannot be empty');
    }
    if (comment.length > 1000) {
      throw new Error('Review comment cannot exceed 1000 characters');
    }
  }

  // Getters
  getId(): ReviewId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getBookId(): BookId {
    return this.bookId;
  }

  getRating(): number {
    return this.rating;
  }

  getComment(): string {
    return this.comment;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateRating(newRating: number): void {
    this.validateRating(newRating);
    this.rating = newRating;
    this.updatedAt = new Date();
  }

  updateComment(newComment: string): void {
    this.validateComment(newComment);
    this.comment = newComment;
    this.updatedAt = new Date();
  }

  updateReview(newRating: number, newComment: string): void {
    this.validateRating(newRating);
    this.validateComment(newComment);
    this.rating = newRating;
    this.comment = newComment;
    this.updatedAt = new Date();
  }

  isPositive(): boolean {
    return this.rating >= 4;
  }

  isNegative(): boolean {
    return this.rating <= 2;
  }

  isNeutral(): boolean {
    return this.rating === 3;
  }

  equals(other: Review): boolean {
    return this.id.equals(other.id);
  }
}