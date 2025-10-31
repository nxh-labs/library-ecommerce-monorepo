import { UserId } from './user';
import { Price } from '../value-objects/price';

export class CartId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Cart ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CartId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class CartItemId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Cart item ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CartItemId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class CartItem {
  private readonly id: CartItemId;
  private readonly bookId: string;
  private quantity: number;
  private readonly addedAt: Date;

  constructor(
    id: CartItemId,
    bookId: string,
    quantity: number,
    addedAt?: Date
  ) {
    if (!bookId || bookId.trim().length === 0) {
      throw new Error('Book ID cannot be empty');
    }
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    this.id = id;
    this.bookId = bookId;
    this.quantity = quantity;
    this.addedAt = addedAt || new Date();
  }

  getId(): CartItemId {
    return this.id;
  }

  getBookId(): string {
    return this.bookId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getAddedAt(): Date {
    return this.addedAt;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity = newQuantity;
  }

  increaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount to increase must be positive');
    }
    this.quantity += amount;
  }

  equals(other: CartItem): boolean {
    return this.bookId === other.bookId;
  }
}

export class Cart {
  private readonly id: CartId;
  private readonly userId: UserId;
  private readonly items: CartItem[];
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: CartId,
    userId: UserId,
    items: CartItem[] = [],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.items = [...items];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Getters
  getId(): CartId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  getUniqueItemsCount(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  hasItem(bookId: string): boolean {
    return this.items.some(item => item.getBookId() === bookId);
  }

  getItem(bookId: string): CartItem | undefined {
    return this.items.find(item => item.getBookId() === bookId);
  }

  addItem(bookId: string, quantity: number, unitPrice?: Price): Cart {
    const existingItem = this.getItem(bookId);

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
      return new Cart(
        this.id,
        this.userId,
        this.items,
        this.createdAt,
        new Date()
      );
    } else {
      const newItemId = new CartItemId(`${this.id.getValue()}-${bookId}-${Date.now()}`);
      const newItem = new CartItem(newItemId, bookId, quantity);
      return new Cart(
        this.id,
        this.userId,
        [...this.items, newItem],
        this.createdAt,
        new Date()
      );
    }
  }

  updateItemQuantity(bookId: string, newQuantity: number): Cart {
    if (newQuantity <= 0) {
      return this.removeItem(bookId);
    }

    const itemIndex = this.items.findIndex(item => item.getBookId() === bookId);
    if (itemIndex < 0) {
      throw new Error('Item not found in cart');
    }

    const updatedItems = [...this.items];
    updatedItems[itemIndex]?.updateQuantity(newQuantity);

    return new Cart(
      this.id,
      this.userId,
      updatedItems,
      this.createdAt,
      new Date()
    );
  }

  removeItem(bookId: string): Cart {
    const filteredItems = this.items.filter(item => item.getBookId() !== bookId);
    if (filteredItems.length === this.items.length) {
      throw new Error('Item not found in cart');
    }

    return new Cart(
      this.id,
      this.userId,
      filteredItems,
      this.createdAt,
      new Date()
    );
  }

  clear(): Cart {
    return new Cart(
      this.id,
      this.userId,
      [],
      this.createdAt,
      new Date()
    );
  }

  // Calculate total price (would need book prices from repository)
  // This is a placeholder - actual implementation would require price lookup
  getEstimatedTotalPrice(bookPrices: Map<string, Price>): Price {
    return this.items.reduce((total, item) => {
      const bookPrice = bookPrices.get(item.getBookId());
      if (!bookPrice) {
        throw new Error(`Price not found for book ${item.getBookId()}`);
      }
      return total.add(bookPrice.multiply(item.getQuantity()));
    }, new Price(0));
  }

  equals(other: Cart): boolean {
    return this.id.equals(other.id);
  }
}