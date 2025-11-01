// Utilitaires de formatage pour l'interface utilisateur

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
    case 'confirmée':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
    case 'expédiée':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
    case 'livrée':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'annulée':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};


export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateISBN = (isbn: string): boolean => {
  // Validation basique ISBN-10 ou ISBN-13
  const isbnRegex = /^(?:\d{10}|\d{13})$/;
  return isbnRegex.test(isbn.replace(/-/g, ''));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};