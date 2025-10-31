import { IsString, IsOptional, IsNumber, IsDateString, IsUrl, Min, Max, Length } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(1, 255)
  title!: string;

  @IsString()
  @Length(10, 17) // ISBN-10 or ISBN-13 with hyphens
  isbn!: string;

  @IsString()
  @Length(1, 255)
  author!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @IsString()
  @Length(1, 255)
  publisher!: string;

  @IsDateString()
  publicationDate!: string;

  @IsString()
  @Length(1, 50)
  language!: string;

  @IsNumber()
  @Min(1)
  pageCount!: number;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  author?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  publisher?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  language?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageCount?: number;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;
}

export interface BookResponseDto {
  id: string;
  title: string;
  isbn: string;
  author: string;
  description?: string;
  price: number;
  stockQuantity: number;
  publisher: string;
  publicationDate: Date;
  language: string;
  pageCount: number;
  coverImageUrl: string | undefined;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BookSearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'title' | 'price' | 'createdAt' | 'id';

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

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class UpdateStockDto {
  @IsNumber()
  @Min(0)
  stockQuantity!: number;
}