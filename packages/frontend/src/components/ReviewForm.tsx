import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoadingSpinner } from './LoadingSpinner';
import { apiService } from '../services/api';

// Schéma de validation
const reviewSchema = z.object({
  rating: z.number().min(1, 'La note doit être d\'au moins 1').max(5, 'La note ne peut pas dépasser 5'),
  comment: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères').max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  bookId: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onReviewSubmitted, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setError(null);
      setSubmitting(true);

      await apiService.reviews.create({
        bookId,
        rating,
        comment: data.comment,
      });

      onReviewSubmitted();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission de l\'avis');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          ))}
        </div>
        <input type="hidden" {...register('rating')} value={rating} />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Commentaire */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Commentaire
        </label>
        <textarea
          {...register('comment')}
          id="comment"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Partagez votre avis sur ce livre..."
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {submitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Soumission...
            </>
          ) : (
            'Soumettre l\'avis'
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;