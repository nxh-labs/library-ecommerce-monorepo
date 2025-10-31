import { CreateReviewUseCase, UpdateReviewUseCase, DeleteReviewUseCase, GetReviewUseCase, GetBookReviewsUseCase, GetUserReviewsUseCase, GetBookRatingUseCase, CreateReviewDto, UpdateReviewDto, ReviewSearchDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
    private readonly getReviewUseCase: GetReviewUseCase,
    private readonly getBookReviewsUseCase: GetBookReviewsUseCase,
    private readonly getUserReviewsUseCase: GetUserReviewsUseCase,
    private readonly getBookRatingUseCase: GetBookRatingUseCase
  ) {}

  async createReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: CreateReviewDto = req.body;
      const review = await this.createReviewUseCase.execute(userId, dto);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Review ID is required' });
        return;
      }
      const userId = req.user!.id.getValue();
      const dto: UpdateReviewDto = req.body;
      const review = await this.updateReviewUseCase.execute(id, userId, dto);
      res.json(review);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Review ID is required' });
        return;
      }
      const userId = req.user!.id.getValue();
      await this.deleteReviewUseCase.execute(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Review ID is required' });
        return;
      }
      const review = await this.getReviewUseCase.execute(id);
      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }
      res.json(review);
    } catch (error) {
      next(error);
    }
  }

  async getBookReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookId } = req.params;
      if (!bookId) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      const dto: ReviewSearchDto = req.query as any;
      const reviews = await this.getBookReviewsUseCase.execute(bookId, dto);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getUserReviews(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id.getValue();
      const dto: ReviewSearchDto = req.query as any;
      const reviews = await this.getUserReviewsUseCase.execute(userId, dto);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getBookRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookId } = req.params;
      if (!bookId) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }
      const rating = await this.getBookRatingUseCase.execute(bookId);
      res.json(rating);
    } catch (error) {
      next(error);
    }
  }
}