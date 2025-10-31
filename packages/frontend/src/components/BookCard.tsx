import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onAddToCart?: (bookId: string) => void;
  showAddToCart?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  showAddToCart = true
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(book.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/books/${book.id}`} className="block">
        {/* Image du livre */}
        <div className="aspect-w-3 aspect-h-4 bg-gray-200 flex items-center justify-center">
          <svg className="w-16 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">
            par {book.author}
          </p>

          {book.category && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
              {book.category.name}
            </span>
          )}

          {/* Prix et stock */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-gray-900">
              {book.price.toFixed(2)} €
            </span>
            <span className={`text-sm ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {book.stock > 0 ? `${book.stock} en stock` : 'Rupture de stock'}
            </span>
          </div>

          {/* Description courte */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {book.description}
          </p>

          {/* Boutons d'action */}
          <div className="flex space-x-2">
            <Link
              to={`/books/${book.id}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
            >
              Voir détails
            </Link>

            {showAddToCart && book.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                aria-label={`Ajouter ${book.title} au panier`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;