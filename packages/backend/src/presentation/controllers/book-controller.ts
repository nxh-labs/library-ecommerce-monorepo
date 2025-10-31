import { CreateBookUseCase, UpdateBookUseCase, DeleteBookUseCase, UpdateBookStockUseCase, GetBookUseCase, GetBooksUseCase, SearchBooksUseCase, CreateBookDto, UpdateBookDto, UpdateStockDto, BookSearchDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class BookController {
  constructor(
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
    private readonly updateBookStockUseCase: UpdateBookStockUseCase,
    private readonly getBookUseCase: GetBookUseCase,
    private readonly getBooksUseCase: GetBooksUseCase,
    private readonly searchBooksUseCase: SearchBooksUseCase
  ) {}

  async createBook(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateBookDto = req.body;
      const book = await this.createBookUseCase.execute(dto);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      const dto: UpdateBookDto = req.body;
      const book = await this.updateBookUseCase.execute(id, dto);
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      await this.deleteBookUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      const dto: UpdateStockDto = req.body;
      await this.updateBookStockUseCase.execute(id, dto);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      const book = await this.getBookUseCase.execute(id);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      res.json(book);
    } catch (error) {
      next(error);
    }
  }

  async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: BookSearchDto = req.query as any;
      const books = await this.getBooksUseCase.execute(dto);
      res.json(books);
    } catch (error) {
      next(error);
    }
  }

  async searchBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: BookSearchDto = req.query as any;
      const books = await this.searchBooksUseCase.execute(dto);
      res.json(books);
    } catch (error) {
      next(error);
    }
  }
}