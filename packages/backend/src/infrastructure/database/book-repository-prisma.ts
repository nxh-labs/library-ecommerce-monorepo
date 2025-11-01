import { IBookRepository, BookId, ISBN, FindBooksOptions, CategoryId, SearchOptions, Book, Price } from '@/domain';
import { CountOptions } from '@/domain/repositories/book-repository';
import { Prisma, PrismaClient } from '@prisma/client';

export class BookRepositoryPrisma implements IBookRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async findById(id: BookId): Promise<Book | null> {
    const bookData = await this.prisma.book.findUnique({
      where: { id: id.getValue() },
      include: { category: true },
    });

    if (!bookData) return null;

    return this.mapToDomain(bookData);
  }

  async findByIsbn(isbn: ISBN): Promise<Book | null> {
    const bookData = await this.prisma.book.findUnique({
      where: { isbn: isbn.getValue() },
      include: { category: true },
    });

    if (!bookData) return null;

    return this.mapToDomain(bookData);
  }

  async findAll(options: FindBooksOptions): Promise<Book[]> {
    const where: any = {};

    if (options.categoryId) {
      where.categoryId = options.categoryId.getValue();
    }

    if (options.priceRange) {
      where.price = {
        gte: options.priceRange.min,
        lte: options.priceRange.max,
      };
    }

    if (options.inStock !== undefined) {
      where.stockQuantity = options.inStock ? { gt: 0 } : 0;
    }

    // Cursor-based pagination
    let cursorCondition: any = {};
    if (options.cursor) {
      const cursorData = this.decodeCursor(options.cursor);
      if (cursorData) {
        cursorCondition = this.buildCursorCondition(cursorData, options.sortBy, options.sortOrder);
      }
    }

    const queryOptions: any = {
      where: {
        ...where,
        ...cursorCondition,
      },
      include: { category: true },
      orderBy: this.buildOrderBy(options.sortBy, options.sortOrder),
      skip: options.cursor ? 1 : options.offset, // Skip cursor itself
    };

    if (options.limit !== undefined) {
      queryOptions.take = Number(options.limit);
    }

    const booksData = await this.prisma.book.findMany(queryOptions);

    return booksData.map(bookData => this.mapToDomain(bookData));
  }

  async findByCategory(categoryId: CategoryId): Promise<Book[]> {
    const booksData = await this.prisma.book.findMany({
      where: { categoryId: categoryId.getValue() },
      include: { category: true },
    });

    return booksData.map(bookData => this.mapToDomain(bookData));
  }

  async search(query: string, options: SearchOptions): Promise<Book[]> {
    const where: any = {};

    if (options.fields) {
      where.OR = options.fields.map(field => ({
        [field]: { contains: query, mode: 'insensitive' },
      }));
    } else {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (options.categoryId) {
      where.categoryId = options.categoryId.getValue();
    }

    if (options.priceRange) {
      where.price = {
        gte: options.priceRange.min,
        lte: options.priceRange.max,
      };
    }

    if (options.inStock !== undefined) {
      where.stockQuantity = options.inStock ? { gt: 0 } : 0;
    }

    // Cursor-based pagination
    let cursorCondition: any = {};
    if (options.cursor) {
      const cursorData = this.decodeCursor(options.cursor);
      if (cursorData) {
        cursorCondition = this.buildCursorCondition(cursorData, options.sortBy, options.sortOrder);
      }
    }

    const queryOptions: any = {
      where: {
        ...where,
        ...cursorCondition,
      },
      include: { category: true },
      orderBy: this.buildOrderBy(options.sortBy, options.sortOrder),
      skip: options.cursor ? 1 : options.offset, // Skip cursor itself
    };

    if (options.limit !== undefined) {
      queryOptions.take = Number(options.limit);
    }

    const booksData = await this.prisma.book.findMany(queryOptions);

    return booksData.map(bookData => this.mapToDomain(bookData));
  }

  async count(options: CountOptions): Promise<number> {
    const where: any = {};

    if (options.categoryId) {
      where.categoryId = options.categoryId.getValue();
    }

    if (options.inStock !== undefined) {
      where.stockQuantity = options.inStock ? { gt: 0 } : 0;
    }

    return await this.prisma.book.count({ where });
  }

  async save(book: Book): Promise<void> {
    const data = this.mapToPrisma(book);

    await this.prisma.book.upsert({
      where: { id: book.getId().getValue() },
      update: data,
      create: data,
    });
  }

  async update(book: Book): Promise<void> {
    const data = this.mapToPrisma(book);

    await this.prisma.book.update({
      where: { id: book.getId().getValue() },
      data,
    });
  }

  async delete(id: BookId): Promise<void> {
    await this.prisma.book.delete({
      where: { id: id.getValue() },
    });
  }

  async updateStock(id: BookId, newStock: number): Promise<void> {
    await this.prisma.book.update({
      where: { id: id.getValue() },
      data: { stockQuantity: newStock, updatedAt: new Date() },
    });
  }

  private buildOrderBy(sortBy?: string, sortOrder?: 'asc' | 'desc'): Prisma.BookOrderByWithRelationInput[] {
    if (!sortBy) return [{ createdAt: 'desc' }, { id: 'desc' }];

    // Always include id as secondary sort for cursor stability
    return [
      { [sortBy]: sortOrder || 'desc' },
      { id: 'desc' }
    ];
  }

  private decodeCursor(cursor: string): { id: string; sortValue: any } | null {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private buildCursorCondition(cursorData: { id: string; sortValue: any }, sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    const sortField = sortBy || 'createdAt';
    const order = sortOrder || 'desc';

    if (order === 'desc') {
      return {
        OR: [
          { [sortField]: { lt: cursorData.sortValue } },
          {
            AND: [
              { [sortField]: { equals: cursorData.sortValue } },
              { id: { lt: cursorData.id } }
            ]
          }
        ]
      };
    } else {
      return {
        OR: [
          { [sortField]: { gt: cursorData.sortValue } },
          {
            AND: [
              { [sortField]: { equals: cursorData.sortValue } },
              { id: { gt: cursorData.id } }
            ]
          }
        ]
      };
    }
  }

  private mapToDomain(bookData: any): Book {
    const categoryId = bookData.categoryId ? new CategoryId(bookData.categoryId) : undefined
    return new Book(
      new BookId(bookData.id),
      bookData.title,
      new ISBN(bookData.isbn),
      bookData.author,
      bookData.description || '',
      new Price(bookData.price),
      bookData.stockQuantity,
      bookData.publisher,
      bookData.publicationDate,
      bookData.language,
      bookData.pageCount,
      bookData.coverImageUrl,
      categoryId,
      bookData.createdAt,
      bookData.updatedAt
    );
  }

  private mapToPrisma(book: Book): any {
    return {
      id: book.getId().getValue(),
      title: book.getTitle(),
      isbn: book.getIsbn().getValue(),
      author: book.getAuthor(),
      description: book.getDescription(),
      price: book.getPrice().getValue(),
      stockQuantity: book.getStockQuantity(),
      publisher: book.getPublisher(),
      publicationDate: book.getPublicationDate(),
      language: book.getLanguage(),
      pageCount: book.getPageCount(),
      coverImageUrl: book.getCoverImageUrl(),
      categoryId: book.getCategoryId()?.getValue(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt(),
    };
  }
}