import { Book } from '../../domain/entities/book';
import { BookResponseDto } from '../../application/dto/book-dto';

export class BookMapper {
  static toResponseDto(book: Book): BookResponseDto {
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
      categoryId: book.getCategoryId()?.getValue(),
      createdAt: book.getCreatedAt(),
      updatedAt: book.getUpdatedAt()
    };
  }

  static toResponseDtoList(books: Book[]): BookResponseDto[] {
    return books.map(book => this.toResponseDto(book));
  }
}