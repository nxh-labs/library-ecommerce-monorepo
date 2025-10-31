import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';


export class CartItemDto {
  @IsString()
  bookId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class AddToCartDto {
  @IsString()
  bookId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(0)
  quantity!: number;
}

export interface CartResponseDto {
  id: string;
  userId: string;
  items: CartItemResponseDto[];
  totalItems: number;
  estimatedTotalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemResponseDto {
  id: string;
  bookId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartSummaryDto {
  totalItems: number;
  totalUniqueItems: number;
  estimatedTotalPrice: number;
}