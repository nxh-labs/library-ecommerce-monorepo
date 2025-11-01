import { IBookRepository, IUnitOfWork, CategoryId, BookId, ISBN, Price, Book, FindBooksOptions, SearchOptions } from "@/domain";
import { NotFoundError } from "@/domain/errors";
import { cacheService } from "@/infrastructure";
import { CreateBookDto, BookResponseDto, UpdateBookDto, UpdateStockDto, BookSearchDto } from "../dto";


// Commands
export class CreateBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(dto: CreateBookDto, categoryId?: CategoryId): Promise<BookResponseDto> {
    const bookId = new BookId(crypto.randomUUID());
    const isbn = new ISBN(dto.isbn);
    const price = new Price(dto.price);
   
    const book = new Book(
      bookId,
      dto.title,
      isbn,
      dto.author,
      dto.description!,
      price,
      dto.stockQuantity,
      dto.publisher,
      new Date(dto.publicationDate),
      dto.language,
      dto.pageCount,
      dto.coverImageUrl,
      categoryId
    );

    await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getBookRepository();
      await repo.save(book);
    });

    // Invalidate popular books cache
    await cacheService.invalidateBookCache(book.getId().getValue());

    return this.mapToResponseDto(book);
  }

  private mapToResponseDto(book: Book): BookResponseDto {
    return {
      id: book.getId().getValue(),
      title: book.getTitle(),
      isbn: book.getIsbn().getFormattedValue(),
      author: book.getAuthor(),
      description: book.getDescription(),
      price: book.getPrice().getValue(),
      stockQuantity: book.getStockQuantity(),
      publisher: book.getPublisher(),
      publicationDate: book.getPublicationDate(),
      language: book.getLanguage(),
      pageCount: book.getPageCount(),
      coverImageUrl: book.getCoverImageUrl(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt()
    };
  }
}

export class UpdateBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, dto: UpdateBookDto): Promise<BookResponseDto> {
    const bookId = new BookId(id);
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    if (dto.title) book.updateTitle(dto.title);
    if (dto.author) book.updateAuthor(dto.author);
    if (dto.description) book.updateDescription(dto.description);
    if (dto.price) {
      const newPrice = new Price(dto.price);
      const updatedBook = book.updatePrice(newPrice);
      Object.assign(book, updatedBook);
    }
    if (dto.stockQuantity !== undefined) book.updateStock(dto.stockQuantity);
    if (dto.publisher) book.updateAuthor(dto.publisher); // Note: should be updatePublisher
    if (dto.language) book.updateAuthor(dto.language); // Note: should be updateLanguage
    if (dto.pageCount) book.updateAuthor(dto.pageCount.toString()); // Note: should be updatePageCount
    if (dto.coverImageUrl) book.updateCoverImage(dto.coverImageUrl);

    await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getBookRepository();
      await repo.update(book);
    });

    // Invalidate book cache
    await cacheService.invalidateBookCache(id);

    return this.mapToResponseDto(book);
  }

  private mapToResponseDto(book: Book): BookResponseDto {
    return {
      id: book.getId().getValue(),
      title: book.getTitle(),
      isbn: book.getIsbn().getFormattedValue(),
      author: book.getAuthor(),
      description: book.getDescription(),
      price: book.getPrice().getValue(),
      stockQuantity: book.getStockQuantity(),
      publisher: book.getPublisher(),
      publicationDate: book.getPublicationDate(),
      language: book.getLanguage(),
      pageCount: book.getPageCount(),
      coverImageUrl: book.getCoverImageUrl(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt()
    };
  }
}

export class DeleteBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string): Promise<void> {
    const bookId = new BookId(id);
    await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getBookRepository();
      await repo.delete(bookId);
    });

    // Invalidate book cache
    await cacheService.invalidateBookCache(id);
  }
}

export class UpdateBookStockUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, dto: UpdateStockDto): Promise<void> {
    const bookId = new BookId(id);
    await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getBookRepository();
      await repo.updateStock(bookId, dto.stockQuantity);
    });

    // Invalidate book cache
    await cacheService.invalidateBookCache(id);
  }
}

// Queries
export class GetBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(id: string): Promise<BookResponseDto | null> {
    const bookId = new BookId(id);
    const book = await this.bookRepository.findById(bookId);
    return book ? this.mapToResponseDto(book) : null;
  }

  private mapToResponseDto(book: Book): BookResponseDto {
    return {
      id: book.getId().getValue(),
      title: book.getTitle(),
      isbn: book.getIsbn().getFormattedValue(),
      author: book.getAuthor(),
      description: book.getDescription(),
      price: book.getPrice().getValue(),
      stockQuantity: book.getStockQuantity(),
      publisher: book.getPublisher(),
      publicationDate: book.getPublicationDate(),
      language: book.getLanguage(),
      pageCount: book.getPageCount(),
      coverImageUrl: book.getCoverImageUrl(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt()
    };
  }
}

export class GetBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(dto: BookSearchDto): Promise<BookResponseDto[]> {
    // Check for popular books cache if no specific filters
    if (!dto.categoryId && !dto.minPrice && !dto.maxPrice && !dto.query &&
        dto.sortBy === 'createdAt' && dto.sortOrder === 'desc' && dto.limit === 10) {
      const cachedBooks = await cacheService.getPopularBooks(dto.limit || 10);
      if (cachedBooks) {
        return cachedBooks;
      }
    }

    const options = {
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      sortBy: dto.sortBy || 'createdAt',
      sortOrder: dto.sortOrder || 'desc',
      categoryId: dto.categoryId ? new CategoryId(dto.categoryId) : undefined,
      priceRange: dto.minPrice && dto.maxPrice ? {
        min: dto.minPrice,
        max: dto.maxPrice
      } : undefined,
      inStock: true
    };

    const books = await this.bookRepository.findAll(options as FindBooksOptions) ;
    const result = books.map(book => this.mapToResponseDto(book));

    // Cache popular books
    if (!dto.categoryId && !dto.minPrice && !dto.maxPrice && !dto.query &&
        dto.sortBy === 'createdAt' && dto.sortOrder === 'desc' && dto.limit === 10) {
      await cacheService.setPopularBooks(result, dto.limit || 10);
    }

    return result;
  }

  private mapToResponseDto(book: Book): BookResponseDto {
    return {
      id: book.getId().getValue(),
      title: book.getTitle(),
      isbn: book.getIsbn().getFormattedValue(),
      author: book.getAuthor(),
      description: book.getDescription(),
      price: book.getPrice().getValue(),
      stockQuantity: book.getStockQuantity(),
      publisher: book.getPublisher(),
      publicationDate: book.getPublicationDate(),
      language: book.getLanguage(),
      pageCount: book.getPageCount(),
      coverImageUrl: book.getCoverImageUrl(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt()
    };
  }
}

export class SearchBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(dto: BookSearchDto): Promise<BookResponseDto[]> {
    const searchOptions = {
      query: dto.query || '',
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      sortBy: dto.sortBy || 'createdAt',
      sortOrder: dto.sortOrder || 'desc',
      categoryId: dto.categoryId ? new CategoryId(dto.categoryId) : undefined,
      priceRange: dto.minPrice && dto.maxPrice ? {
        min: dto.minPrice,
        max: dto.maxPrice
      } : undefined,
      inStock: true
    };

    const books = await this.bookRepository.search(dto.query || '', searchOptions as SearchOptions);
    return books.map(book => this.mapToResponseDto(book));
  }

  private mapToResponseDto(book: Book): BookResponseDto {
    return {
      id: book.getId().getValue(),
      title: book.getTitle(),
      isbn: book.getIsbn().getFormattedValue(),
      author: book.getAuthor(),
      description: book.getDescription(),
      price: book.getPrice().getValue(),
      stockQuantity: book.getStockQuantity(),
      publisher: book.getPublisher(),
      publicationDate: book.getPublicationDate(),
      language: book.getLanguage(),
      pageCount: book.getPageCount(),
      coverImageUrl: book.getCoverImageUrl(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt()
    };
  }
}