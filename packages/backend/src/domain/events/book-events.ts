import { BaseDomainEvent } from './domain-event';
import { Price } from '../value-objects/price';

export class BookCreatedEvent extends BaseDomainEvent {
  constructor(
    public readonly bookId: string,
    public readonly title: string,
    public readonly isbn: string,
    public readonly price: Price
  ) {
    super(bookId);
  }

  protected getEventType(): string {
    return 'BookCreated';
  }
}

export class BookPriceChangedEvent extends BaseDomainEvent {
  constructor(
    public readonly bookId: string,
    public readonly oldPrice: Price,
    public readonly newPrice: Price
  ) {
    super(bookId);
  }

  protected getEventType(): string {
    return 'BookPriceChanged';
  }
}

export class BookStockChangedEvent extends BaseDomainEvent {
  constructor(
    public readonly bookId: string,
    public readonly oldStock: number,
    public readonly newStock: number
  ) {
    super(bookId);
  }

  protected getEventType(): string {
    return 'BookStockChanged';
  }
}

export class BookOutOfStockEvent extends BaseDomainEvent {
  constructor(public readonly bookId: string) {
    super(bookId);
  }

  protected getEventType(): string {
    return 'BookOutOfStock';
  }
}