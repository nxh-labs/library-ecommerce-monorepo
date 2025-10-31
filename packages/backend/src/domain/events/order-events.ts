import { BaseDomainEvent } from './domain-event';
import { Price } from '../value-objects/price';
import { OrderStatus } from '../value-objects/order-status';

export class OrderCreatedEvent extends BaseDomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly totalAmount: Price
  ) {
    super(orderId);
  }

  protected getEventType(): string {
    return 'OrderCreated';
  }
}

export class OrderStatusChangedEvent extends BaseDomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly oldStatus: OrderStatus,
    public readonly newStatus: OrderStatus
  ) {
    super(orderId);
  }

  protected getEventType(): string {
    return 'OrderStatusChanged';
  }
}

export class OrderCancelledEvent extends BaseDomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly reason?: string
  ) {
    super(orderId);
  }

  protected getEventType(): string {
    return 'OrderCancelled';
  }
}

export class OrderShippedEvent extends BaseDomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly trackingNumber?: string
  ) {
    super(orderId);
  }

  protected getEventType(): string {
    return 'OrderShipped';
  }
}

export class OrderDeliveredEvent extends BaseDomainEvent {
  constructor(public readonly orderId: string) {
    super(orderId);
  }

  protected getEventType(): string {
    return 'OrderDelivered';
  }
}