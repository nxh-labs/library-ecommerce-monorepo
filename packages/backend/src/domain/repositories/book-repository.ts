import { Book, BookId } from '../entities/book';
import { ISBN } from '../value-objects/isbn';
import { CategoryId } from '../entities/category';

export interface FindBooksOptions {
  limit?: number;
  offset?: number;
  cursor?: string; // For cursor-based pagination
  sortBy?: 'title' | 'price' | 'createdAt' | 'id';
  sortOrder?: 'asc' | 'desc';
  categoryId?: CategoryId;
  priceRange?: { min: number; max: number };
  inStock?: boolean;
}

export interface SearchOptions extends FindBooksOptions {
  query: string;
  fields?: ('title' | 'author' | 'description')[];
}

export interface CountOptions {
  categoryId?: CategoryId;
  inStock?: boolean;
}

export interface IBookRepository {
  // Queries
  findById(id: BookId): Promise<Book | null>;
  findByIsbn(isbn: ISBN): Promise<Book | null>;
  findAll(options: FindBooksOptions): Promise<Book[]>;
  findByCategory(categoryId: CategoryId): Promise<Book[]>;
  search(query: string, options: SearchOptions): Promise<Book[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(id: BookId): Promise<void>;
  updateStock(id: BookId, newStock: number): Promise<void>;
}