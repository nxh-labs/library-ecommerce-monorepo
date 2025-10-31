// Types TypeScript basés sur les DTOs du backend

export interface User {
   id: string;
   email: string;
   firstName: string;
   lastName: string;
   role: UserRole;
   createdAt: string;
   updatedAt: string;
   lastLoginAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  user: User;
  book: Book;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Enums
export type UserRole = 'USER' | 'ADMIN';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// DTOs pour les formulaires
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   role?: UserRole;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  publishedAt: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {
  id: string;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface CreateReviewDto {
   bookId: string;
   rating: number;
   comment: string;
}

export interface ChangePasswordDto {
   currentPassword: string;
   newPassword: string;
}

// Types pour l'état global
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
}

export interface AppState {
  auth: AuthState;
  cart: CartState;
}

// Types pour les API responses
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}