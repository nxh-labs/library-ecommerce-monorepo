import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Book, Review } from '../types';
import { apiService } from '../services/api';
import { useAuth, useCart } from '../context/AppContext';
import ReviewForm from '../components/ReviewForm';

// Fonction utilitaire pour les notifications
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  // Implémentation simple avec alert pour l'instant
  // À remplacer par une vraie bibliothèque de notifications
  if (type === 'success') {
    alert(`✅ ${message}`);
  } else {
    alert(`❌ ${message}`);
  }
};

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/books');
      return;
    }

    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await apiService.books.getById(id);
        setBook(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du livre');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await apiService.reviews.getByBook(id);
        setReviews(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des avis:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchBook();
    fetchReviews();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!book) return;

    try {
      setAddingToCart(true);
      await addItem({ bookId: book.id, quantity: 1, book });
      // Afficher une notification de succès
      showNotification('Livre ajouté au panier !', 'success');
    } catch (err) {
      showNotification('Erreur lors de l\'ajout au panier', 'error');
      console.error('Erreur:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    // Recharger les avis
    try {
      setReviewsLoading(true);
      if(!id) throw new Error('id must be provided')
      const response = await apiService.reviews.getByBook(id);
      setReviews(response.data);
    } catch (err) {
      console.error('Erreur lors du rechargement des avis:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          message={error || 'Livre non trouvé'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Image du livre */}
            <div className="md:w-1/3 p-8 flex items-center justify-center bg-gray-50">
              <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-20 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>

            {/* Informations du livre */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">par {book.author}</p>

                {book.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                    {book.category.name}
                  </span>
                )}
              </div>

              {/* Prix et stock */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {book.price.toFixed(2)} €
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    book.stockQuantity > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.stockQuantity > 0 ? `${book.stockQuantity} en stock` : 'Rupture de stock'}
                  </span>
                </div>

                {/* ISBN et date */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>ISBN:</strong> {book.isbn}</p>
                  <p><strong>Date de publication:</strong> {new Date(book.publicationDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stockQuantity === 0 || addingToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Ajout en cours...
                    </>
                  ) : book.stockQuantity > 0 ? (
                    'Ajouter au panier'
                  ) : (
                    'Indisponible'
                  )}
                </button>

                <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors">
                  Ajouter aux favoris
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Avis */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis des lecteurs</h2>

          {reviewsLoading ? (
            <LoadingSpinner className="py-8" />
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          )}

          {user && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {showReviewForm ? 'Annuler' : 'Écrire un avis'}
              </button>

              {showReviewForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <ReviewForm
                    bookId={id!}
                    onReviewSubmitted={handleReviewSubmitted}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;