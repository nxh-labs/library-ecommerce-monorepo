import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

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
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Pas de refresh token, déconnexion
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('user');
        window.location.href = '/login';
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
      api.post<ApiResponse<{ user: any; token: string; refreshToken: string }>>('/auth/login', credentials),

    register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
      api.post<ApiResponse<{ user: any; token: string; refreshToken: string }>>('/users/register', userData),

    getProfile: () =>
      api.get<ApiResponse<any>>('/users/me'),

    updateProfile: (userData: Partial<any>) =>
      api.put<ApiResponse<any>>('/users/me', userData),

    refreshToken: (refreshToken: string) =>
      api.post<ApiResponse<{ user: any; token: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),

    logout: () =>
      api.post<ApiResponse<void>>('/auth/logout'),
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
      api.get<PaginatedResponse<any>>('/books', { params }),

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
      api.get<PaginatedResponse<any>>('/books/search', { params }),

    getById: (id: string) =>
      api.get<ApiResponse<any>>(`/books/${id}`),

    create: (bookData: any) =>
      api.post<ApiResponse<any>>('/books', bookData),

    update: (id: string, bookData: Partial<any>) =>
      api.put<ApiResponse<any>>(`/books/${id}`, bookData),

    delete: (id: string) =>
      api.delete<ApiResponse<void>>(`/books/${id}`),

    updateStock: (id: string, stockQuantity: number) =>
      api.patch<ApiResponse<void>>(`/books/${id}/stock`, { stockQuantity }),
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
      api.get<PaginatedResponse<any>>('/categories', { params }),

    getHierarchy: () =>
      api.get<ApiResponse<any[]>>('/categories/hierarchy'),

    getById: (id: string) =>
      api.get<ApiResponse<any>>(`/categories/${id}`),

    create: (categoryData: any) =>
      api.post<ApiResponse<any>>('/categories', categoryData),

    update: (id: string, categoryData: Partial<any>) =>
      api.put<ApiResponse<any>>(`/categories/${id}`, categoryData),

    delete: (id: string) =>
      api.delete<ApiResponse<void>>(`/categories/${id}`),
  },

  // Panier
  cart: {
    get: () =>
      api.get<ApiResponse<any>>('/cart'),

    getSummary: () =>
      api.get<ApiResponse<any>>('/cart/summary'),

    addItem: (bookId: string, quantity: number) =>
      api.post<ApiResponse<any>>('/cart/items', { bookId, quantity }),

    updateItem: (itemId: string, quantity: number) =>
      api.put<ApiResponse<any>>(`/cart/items/${itemId}`, { quantity }),

    removeItem: (bookId: string) =>
      api.delete<ApiResponse<any>>(`/cart/items/${bookId}`),

    clear: () =>
      api.delete<ApiResponse<void>>('/cart'),
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
      api.get<PaginatedResponse<any>>('/orders', { params }),

    getById: (id: string) =>
      api.get<ApiResponse<any>>(`/orders/${id}`),

    create: (orderData: any) =>
      api.post<ApiResponse<any>>('/orders', orderData),

    updateAddress: (id: string, addressData: any) =>
      api.put<ApiResponse<any>>(`/orders/${id}/address`, addressData),

    updateStatus: (id: string, status: string) =>
      api.put<ApiResponse<any>>(`/orders/${id}/status`, { status }),
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
      api.get<PaginatedResponse<any>>(`/reviews/book/${bookId}`, { params }),

    getBookRating: (bookId: string) =>
      api.get<ApiResponse<any>>(`/reviews/book/${bookId}/rating`),

    getById: (id: string) =>
      api.get<ApiResponse<any>>(`/reviews/${id}`),

    create: (reviewData: { bookId: string; rating: number; comment: string }) =>
      api.post<ApiResponse<any>>('/reviews', reviewData),

    update: (id: string, reviewData: Partial<{ rating: number; comment: string }>) =>
      api.put<ApiResponse<any>>(`/reviews/${id}`, reviewData),

    delete: (id: string) =>
      api.delete<ApiResponse<void>>(`/reviews/${id}`),

    getUserReviews: (params?: {
      rating?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) =>
      api.get<PaginatedResponse<any>>('/reviews/user/reviews', { params }),
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
      api.get<PaginatedResponse<any>>('/users', { params }),

    getById: (id: string) =>
      api.get<ApiResponse<any>>(`/users/${id}`),

    update: (id: string, userData: Partial<any>) =>
      api.put<ApiResponse<any>>(`/users/${id}`, userData),

    delete: (id: string) =>
      api.delete<ApiResponse<void>>(`/users/${id}`),

    changePassword: (currentPassword: string, newPassword: string) =>
      api.put<ApiResponse<void>>('/users/me/password', { currentPassword, newPassword }),
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