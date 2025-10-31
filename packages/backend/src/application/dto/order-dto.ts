import { IsString, IsOptional, IsNumber, IsEnum, IsArray, ValidateNested, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/value-objects/order-status';

export class OrderItemDto {
  @IsString()
  bookId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsString()
  @Length(1, 500)
  shippingAddress!: string;

  @IsString()
  @Length(1, 500)
  billingAddress!: string;
}

export interface OrderResponseDto {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItemResponseDto[];
  shippingAddress: string;
  billingAddress: string;
  totalAmount: number;
  orderDate: Date;
  updatedAt: Date;
}

export interface OrderItemResponseDto {
  bookId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}

export class OrderSearchDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'orderDate' | 'totalAmount' | 'status';

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

export class UpdateOrderAddressDto {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  billingAddress?: string;
}