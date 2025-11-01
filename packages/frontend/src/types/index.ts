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
  isbn: string;
  author: string;
  description: string;
  price: number;
  stockQuantity: number;
  publisher: string;
  publicationDate: string;
  language: string;
  pageCount: number;
  coverImageUrl?: string;
  categoryId: string;
  category?: Category;
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
  totalItems: number;
  estimatedTotalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  addedAt: string;
  book?: Book;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  totalAmount: number;
  orderDate: string;
  updatedAt: string;
  user?: User;
}

export interface OrderItem {
  bookId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  book?: Book;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  book?: Book;
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
  isbn: string;
  author: string;
  description: string;
  price: number;
  stockQuantity: number;
  publisher: string;
  publicationDate: string;
  language: string;
  pageCount: number;
  coverImageUrl?: string;
  categoryId: string;
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

export interface CreateOrderDto {
  items: Array<{
    bookId: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: string;
  billingAddress: string;
}

export interface UpdateOrderAddressDto {
  shippingAddress?: string;
  billingAddress?: string;
}

export interface CartSummary {
  totalItems: number;
  totalUniqueItems: number;
  estimatedTotalPrice: number;
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