import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorData, ApiResponse, Book, Cart, CartItem, CartResponseDto, CartSummary, Category, CategoryHierarchy, CreateBookDto, CreateCategoryDto, CreateOrderDto, Order, PaginatedResponse, Review, User } from '../types';

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configuration pour les tokens
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Création de l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Callback (hook) externe pour gérer le 401 globalement
let onUnauthorized: null | (() => void) = null;
export function setOnUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

// Interceptor pour ajouter le token d'authentification
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs de réponse et le refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        try {
          // Tenter de rafraîchir le token
          const refreshResponse = await api.post('/auth/refresh', { refreshToken });
          const { token, refreshToken: newRefreshToken } = refreshResponse.data;

          // Stocker les nouveaux tokens
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Échec du refresh, déconnexion
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem('user');
          if (onUnauthorized) onUnauthorized();
          return Promise.reject(refreshError);
        }
      } else {
        // Pas de refresh token, déconnexion
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('user');
        if (onUnauthorized) onUnauthorized();
      }
    }

    return Promise.reject(error);
  }
);

// Fonctions utilitaires pour les appels API
export const apiService = {
  // Authentification
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post<{ user: User; token: string; refreshToken: string }>('/auth/login', credentials),

    register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
      api.post<{ user: User; token: string; refreshToken: string }>('/users/register', userData),

    getProfile: () =>
      api.get<User>('/users/me'),

    updateProfile: (userData: Partial<any>) =>
      api.put<User>('/users/me', userData),

    refreshToken: (refreshToken: string) =>
      api.post<{ user: User; token: string; refreshToken: string }>('/auth/refresh', { refreshToken }),

    logout: () =>
      api.post<{ message: string } >('/auth/logout'),
  },

  // Livres
  books: {
    getAll: (params?: {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
      cursor?: string;
    }) =>
      api.get<Book[]>('/books', { params }),

    search: (params: {
      query: string;
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
      cursor?: string;
    }) =>
      api.get<Book[]>('/books/search', { params }),

    getById: (id: string) =>
      api.get<Book>(`/books/${id}`),

    create: (bookData: CreateBookDto) =>
      api.post<Book >('/books', bookData),

    update: (id: string, bookData: Partial<CreateBookDto>) =>
      api.put<Book >(`/books/${id}`, bookData),

    delete: (id: string) =>
      api.delete<void >(`/books/${id}`),

    updateStock: (id: string, stockQuantity: number) =>
      api.patch<void >(`/books/${id}/stock`, { stockQuantity }),
  },

  // Catégories
  categories: {
    getAll: (params?: {
      parentId?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) =>
      api.get<Category[]>('/categories', { params }),

    getHierarchy: () =>
      api.get<CategoryHierarchy[]>('/categories/hierarchy'),

    getById: (id: string) =>
      api.get<Category >(`/categories/${id}`),

    create: (categoryData: CreateCategoryDto) =>
      api.post<Category >('/categories', categoryData),

    update: (id: string, categoryData: Partial<CreateCategoryDto>) =>
      api.put<Category >(`/categories/${id}`, categoryData),

    delete: (id: string) =>
      api.delete<void >(`/categories/${id}`),
  },

  // Panier
  cart: {
    get: () =>
      api.get<Cart >('/cart'),

    getSummary: () =>
      api.get<CartSummary >('/cart/summary'),

    addItem: (bookId: string, quantity: number) =>
      api.post<CartResponseDto >('/cart/items', { bookId, quantity }),

    updateItem: (itemId: string, quantity: number) =>
      api.put<CartResponseDto >(`/cart/items/${itemId}`, { quantity }),

    removeItem: (bookId: string) =>
      api.delete<CartResponseDto >(`/cart/items/${bookId}`),

    clear: () =>
      api.delete<void >('/cart'),
  },

  // Commandes
  orders: {
    getAll: (params?: {
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) =>
      api.get<Order[] >('/orders', { params }),

    getById: (id: string) =>
      api.get<Order >(`/orders/${id}`),

    create: (orderData: CreateOrderDto) =>
      api.post<Order >('/orders', orderData),

    updateAddress: (id: string, addressData: any) =>
      api.put<Order >(`/orders/${id}/address`, addressData),

    updateStatus: (id: string, status: string) =>
      api.put<Order >(`/orders/${id}/status`, { status }),
  },

  // Avis
  reviews: {
    getByBook: (bookId: string, params?: {
      rating?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) =>
      api.get<Review[] >(`/reviews/book/${bookId}`, { params }),

    getBookRating: (bookId: string) =>
      api.get<{
        bookId: string,
        averageRating: number,
        totalReviews: number
      } >(`/reviews/book/${bookId}/rating`),

    getById: (id: string) =>
      api.get<Review >(`/reviews/${id}`),

    create: (reviewData: { bookId: string; rating: number; comment: string }) =>
      api.post<Review >('/reviews', reviewData),

    update: (id: string, reviewData: Partial<{ rating: number; comment: string }>) =>
      api.put<Review >(`/reviews/${id}`, reviewData),

    delete: (id: string) =>
      api.delete<void >(`/reviews/${id}`),

    getUserReviews: (params?: {
      rating?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) =>
      api.get<Review[],ApiErrorData>('/reviews/user/reviews', { params }),
  },

  // Utilisateurs (Admin seulement)
  users: {
    getAll: (params?: {
      role?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) =>
      api.get<User[],ApiErrorData>('/users', { params }),

    getById: (id: string) =>
      api.get<User,ApiErrorData>(`/users/${id}`),

    update: (id: string, userData: Partial<Omit<User,'id' | 'createAt' | "updatedAt">>) =>
      api.put<User,ApiErrorData>(`/users/${id}`, userData),

    delete: (id: string) =>
      api.delete<void ,ApiErrorData>(`/users/${id}`),

    changePassword: (currentPassword: string, newPassword: string) =>
      api.put<void,ApiErrorData>('/users/me/password', { currentPassword, newPassword }),
  },
};

// Fonctions utilitaires pour la gestion des erreurs et états de chargement
export const apiUtils = {
  // Gestion des erreurs HTTP
  handleError: (error: any): string => {
    if (error.response) {
      // Erreur de réponse du serveur
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return data.message || 'Données invalides';
        case 401:
          return 'Non autorisé - Veuillez vous reconnecter';
        case 403:
          return 'Accès refusé';
        case 404:
          return 'Ressource non trouvée';
        case 409:
          return 'Conflit - Ressource déjà existante';
        case 422:
          return data.message || 'Erreur de validation';
        case 500:
          return 'Erreur interne du serveur';
        default:
          return data.message || `Erreur ${status}`;
      }
    } else if (error.request) {
      // Erreur de réseau
      return 'Erreur de connexion réseau';
    } else {
      // Erreur inconnue
      return error.message || 'Une erreur inattendue s\'est produite';
    }
  },

  // Gestion des états de chargement
  createLoadingState: <T>() => ({
    data: null as T | null,
    loading: false,
    error: null as string | null,
  }),

  // Wrapper pour les appels API avec gestion d'état
  withLoadingState: async <T>(
    apiCall: () => Promise<T>,
    setState: (state: { data: T | null; loading: boolean; error: string | null }) => void
  ): Promise<T | null> => {
    try {
      setState({ data: null, loading: true, error: null });
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  },
};

export default api;
