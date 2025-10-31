import { IsString, IsOptional, IsNumber, IsEnum, Min, Max, Length } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  bookId!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @Length(1, 1000)
  comment!: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  comment?: string;
}

export interface ReviewResponseDto {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewSearchDto {
  @IsOptional()
  @IsString()
  bookId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'rating';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}

export interface BookRatingDto {
  bookId: string;
  averageRating: number;
  totalReviews: number;
}