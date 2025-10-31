import { Router } from 'express';
import { ReviewController } from '../controllers/review-controller';
import { authenticate } from '../../infrastructure/http/middlewares';

export function createReviewRoutes(reviewController: ReviewController): Router {
  const router = Router();

  // Public routes
  router.get('/book/:bookId', reviewController.getBookReviews.bind(reviewController));
  router.get('/book/:bookId/rating', reviewController.getBookRating.bind(reviewController));
  router.get('/:id', reviewController.getReview.bind(reviewController));

  // Authenticated routes
  router.post('/', authenticate, reviewController.createReview.bind(reviewController));
  router.put('/:id', authenticate, reviewController.updateReview.bind(reviewController));
  router.delete('/:id', authenticate, reviewController.deleteReview.bind(reviewController));
  router.get('/user/reviews', authenticate, reviewController.getUserReviews.bind(reviewController));

  return router;
}