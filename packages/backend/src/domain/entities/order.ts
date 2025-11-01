import { UserId } from './user';
import { Price } from '../value-objects/price';
import { OrderStatusValue } from '../value-objects/order-status';
import { ValidationError } from '../errors';

export class OrderId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Order ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class OrderItem {
  private readonly bookId: string;
  private quantity: number;
  private readonly unitPrice: Price;

  constructor(bookId: string, quantity: number, unitPrice: Price) {
    if (!bookId || bookId.trim().length === 0) {
      throw new ValidationError('Book ID cannot be empty');
    }
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }

    this.bookId = bookId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  getBookId(): string {
    return this.bookId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getUnitPrice(): Price {
    return this.unitPrice;
  }

  getTotalPrice(): Price {
    return this.unitPrice.multiply(this.quantity);
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new ValidationError('Quantity must be positive');
    }
    this.quantity = newQuantity;
  }

  equals(other: OrderItem): boolean {
    return this.bookId === other.bookId;
  }
}

export class Order {
  private readonly id: OrderId;
  private readonly userId: UserId;
  private readonly status: OrderStatusValue;
  private readonly items: OrderItem[];
  private shippingAddress: string;
  private billingAddress: string;
  private readonly orderDate: Date;
  private updatedAt: Date;

  constructor(
    id: OrderId,
    userId: UserId,
    status: OrderStatusValue,
    items: OrderItem[],
    shippingAddress: string,
    billingAddress: string,
    orderDate?: Date,
    updatedAt?: Date
  ) {
    this.validateItems(items);
    this.validateAddress(shippingAddress, 'shipping');
    this.validateAddress(billingAddress, 'billing');

    this.id = id;
    this.userId = userId;
    this.status = status;
    this.items = [...items];
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.orderDate = orderDate || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validateItems(items: OrderItem[]): void {
    if (!items || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }
  }

  private validateAddress(address: string, type: string): void {
    if (!address || address.trim().length === 0) {
      throw new ValidationError(`${type} address cannot be empty`);
    }
    if (address.length > 500) {
      throw new ValidationError(`${type} address cannot exceed 500 characters`);
    }
  }

  // Getters
  getId(): OrderId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getStatus(): OrderStatusValue {
    return this.status;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getShippingAddress(): string {
    return this.shippingAddress;
  }

  getBillingAddress(): string {
    return this.billingAddress;
  }

  getOrderDate(): Date {
    return this.orderDate;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  getTotalAmount(): Price {
    return this.items.reduce(
      (total, item) => total.add(item.getTotalPrice()),
      new Price(0)
    );
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  updateShippingAddress(newAddress: string): void {
    this.validateAddress(newAddress, 'shipping');
    this.shippingAddress = newAddress;
    this.updatedAt = new Date();
  }

  updateBillingAddress(newAddress: string): void {
    this.validateAddress(newAddress, 'billing');
    this.billingAddress = newAddress;
    this.updatedAt = new Date();
  }

  canBeCancelled(): boolean {
    return this.status.canBeCancelled();
  }

  canBeShipped(): boolean {
    return this.status.canBeShipped();
  }

  canBeDelivered(): boolean {
    return this.status.canBeDelivered();
  }

  canBeRefunded(): boolean {
    return this.status.canBeRefunded();
  }

  isCompleted(): boolean {
    return this.status.isCompleted();
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  addItem(item: OrderItem): Order {
    // Check if item already exists
    const existingItemIndex = this.items.findIndex(existing => existing.equals(item));
    if (existingItemIndex >= 0) {
      throw new ValidationError('Item already exists in order');
    }

    return new Order(
      this.id,
      this.userId,
      this.status,
      [...this.items, item],
      this.shippingAddress,
      this.billingAddress,
      this.orderDate,
      new Date()
    );
  }

  updateItem(bookId: string, newQuantity: number): Order {
    const itemIndex = this.items.findIndex(item => item.getBookId() === bookId);
    if (itemIndex < 0) {
      throw new Error('Item not found in order');
    }

    const updatedItems = [...this.items];
    updatedItems[itemIndex]?.updateQuantity(newQuantity);

    return new Order(
      this.id,
      this.userId,
      this.status,
      updatedItems,
      this.shippingAddress,
      this.billingAddress,
      this.orderDate,
      new Date()
    );
  }

  removeItem(bookId: string): Order {
    const filteredItems = this.items.filter(item => item.getBookId() !== bookId);
    if (filteredItems.length === this.items.length) {
      throw new ValidationError('Item not found in order');
    }
    if (filteredItems.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    return new Order(
      this.id,
      this.userId,
      this.status,
      filteredItems,
      this.shippingAddress,
      this.billingAddress,
      this.orderDate,
      new Date()
    );
  }

  equals(other: Order): boolean {
    return this.id.equals(other.id);
  }
}