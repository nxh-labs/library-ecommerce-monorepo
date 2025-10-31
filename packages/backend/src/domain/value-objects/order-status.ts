export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export class OrderStatusValue {
  private readonly value: OrderStatus;

  constructor(value: OrderStatus) {
    this.value = value;
  }

  getValue(): OrderStatus {
    return this.value;
  }

  canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.value);
  }

  canBeShipped(): boolean {
    return [OrderStatus.CONFIRMED, OrderStatus.PROCESSING].includes(this.value);
  }

  canBeDelivered(): boolean {
    return this.value === OrderStatus.SHIPPED;
  }

  canBeRefunded(): boolean {
    return [OrderStatus.DELIVERED, OrderStatus.SHIPPED].includes(this.value);
  }

  isCompleted(): boolean {
    return [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(this.value);
  }

  isActive(): boolean {
    return !this.isCompleted();
  }

  equals(other: OrderStatusValue): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}