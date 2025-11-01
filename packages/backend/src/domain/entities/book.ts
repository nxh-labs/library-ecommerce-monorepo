import { ISBN } from '../value-objects/isbn';
import { Price } from '../value-objects/price';
import { CategoryId } from './category';
import { ValidationError } from '../errors';

export class BookId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Book ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BookId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class Book {
  private readonly id: BookId;
  private title: string;
  private readonly isbn: ISBN;
  private author: string;
  private description: string;
  private readonly price: Price;
  private stockQuantity: number;
  private publisher: string;
  private publicationDate: Date;
  private language: string;
  private pageCount: number;
  private coverImageUrl?: string;
  private categoryId?: CategoryId
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: BookId,
    title: string,
    isbn: ISBN,
    author: string,
    description: string,
    price: Price,
    stockQuantity: number,
    publisher: string,
    publicationDate: Date,
    language: string,
    pageCount: number,
    coverImageUrl?: string,
    categoryId?: CategoryId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateTitle(title);
    this.validateAuthor(author);
    this.validateDescription(description);
    this.validateStockQuantity(stockQuantity);
    this.validatePublisher(publisher);
    this.validateLanguage(language);
    this.validatePageCount(pageCount);

    this.id = id;
    this.title = title;
    this.isbn = isbn;
    this.author = author;
    this.description = description;
    this.price = price;
    this.stockQuantity = stockQuantity;
    this.publisher = publisher;
    this.publicationDate = publicationDate;
    this.language = language;
    this.pageCount = pageCount;
    if(coverImageUrl) this.coverImageUrl = coverImageUrl;
    if(categoryId) this.categoryId  = categoryId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Book title cannot be empty');
    }
    if (title.length > 255) {
      throw new ValidationError('Book title cannot exceed 255 characters');
    }
  }

  private validateAuthor(author: string): void {
    if (!author || author.trim().length === 0) {
      throw new ValidationError('Book author cannot be empty');
    }
    if (author.length > 255) {
      throw new ValidationError('Book author cannot exceed 255 characters');
    }
  }

  private validateDescription(description: string): void {
    if (description && description.length > 2000) {
      throw new ValidationError('Book description cannot exceed 2000 characters');
    }
  }

  private validateStockQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new ValidationError('Stock quantity cannot be negative');
    }
  }

  private validatePublisher(publisher: string): void {
    if (!publisher || publisher.trim().length === 0) {
      throw new ValidationError('Book publisher cannot be empty');
    }
    if (publisher.length > 255) {
      throw new ValidationError('Book publisher cannot exceed 255 characters');
    }
  }

  private validateLanguage(language: string): void {
    if (!language || language.trim().length === 0) {
      throw new ValidationError('Book language cannot be empty');
    }
    if (language.length > 50) {
      throw new ValidationError('Book language cannot exceed 50 characters');
    }
  }

  private validatePageCount(pageCount: number): void {
    if (pageCount <= 0) {
      throw new ValidationError('Page count must be positive');
    }
  }

  // Getters
  getId(): BookId {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getIsbn(): ISBN {
    return this.isbn;
  }

  getAuthor(): string {
    return this.author;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): Price {
    return this.price;
  }

  getStockQuantity(): number {
    return this.stockQuantity;
  }

  getPublisher(): string {
    return this.publisher;
  }

  getPublicationDate(): Date {
    return this.publicationDate;
  }

  getLanguage(): string {
    return this.language;
  }

  getPageCount(): number {
    return this.pageCount;
  }

  getCoverImageUrl(): string | undefined {
    return this.coverImageUrl;
  }
  getCategoryId() : CategoryId | undefined {
    return this.categoryId;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateTitle(newTitle: string): void {
    this.validateTitle(newTitle);
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  updateAuthor(newAuthor: string): void {
    this.validateAuthor(newAuthor);
    this.author = newAuthor;
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string): void {
    this.validateDescription(newDescription);
    this.description = newDescription;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: Price): Book {
    return new Book(
      this.id,
      this.title,
      this.isbn,
      this.author,
      this.description,
      newPrice,
      this.stockQuantity,
      this.publisher,
      this.publicationDate,
      this.language,
      this.pageCount,
      this.coverImageUrl,
      this.categoryId,
      this.createdAt,
      new Date()
    );
  }

  updateStock(newQuantity: number): void {
    this.validateStockQuantity(newQuantity);
    this.stockQuantity = newQuantity;
    this.updatedAt = new Date();
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError('Quantity to decrease must be positive');
    }
    if (this.stockQuantity < quantity) {
      throw new ValidationError('Insufficient stock');
    }
    this.stockQuantity -= quantity;
    this.updatedAt = new Date();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError('Quantity to increase must be positive');
    }
    this.stockQuantity += quantity;
    this.updatedAt = new Date();
  }

  isInStock(): boolean {
    return this.stockQuantity > 0;
  }

  hasEnoughStock(quantity: number): boolean {
    return this.stockQuantity >= quantity;
  }

  updateCoverImage(url: string): void {
    this.coverImageUrl = url;
    this.updatedAt = new Date();
  }

  equals(other: Book): boolean {
    return this.id.equals(other.id);
  }
}