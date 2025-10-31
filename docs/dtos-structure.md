# Structure des DTOs

## DTOs pour les Livres (Books)

### BookDTO
```typescript
interface BookDTO {
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
  category: CategoryDTO;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### CreateBookDTO
```typescript
interface CreateBookDTO {
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
  categoryId: string;
  coverImageUrl?: string;
}
```

### UpdateBookDTO
```typescript
interface UpdateBookDTO {
  title?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  coverImageUrl?: string;
}
```

## DTOs pour les Utilisateurs (Users)

### UserDTO
```typescript
interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### RegisterUserDTO
```typescript
interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

### LoginUserDTO
```typescript
interface LoginUserDTO {
  email: string;
  password: string;
}
```

### AuthResponseDTO
```typescript
interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

## DTOs pour les Commandes (Orders)

### OrderDTO
```typescript
interface OrderDTO {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: AddressDTO;
  billingAddress: AddressDTO;
  orderItems: OrderItemDTO[];
  orderDate: string;
  updatedAt: string;
}
```

### OrderItemDTO
```typescript
interface OrderItemDTO {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

### CreateOrderDTO
```typescript
interface CreateOrderDTO {
  cartId: string;
  shippingAddress: AddressDTO;
  billingAddress: AddressDTO;
  paymentMethod: PaymentMethodDTO;
}
```

## DTOs pour le Panier (Cart)

### CartDTO
```typescript
interface CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
```

### CartItemDTO
```typescript
interface CartItemDTO {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}
```

### AddToCartDTO
```typescript
interface AddToCartDTO {
  bookId: string;
  quantity: number;
}
```

## DTOs pour les Avis (Reviews)

### ReviewDTO
```typescript
interface ReviewDTO {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
```

### CreateReviewDTO
```typescript
interface CreateReviewDTO {
  bookId: string;
  rating: number;
  comment?: string;
}
```

### BookReviewsDTO
```typescript
interface BookReviewsDTO {
  reviews: ReviewDTO[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
```

## DTOs pour les Catégories (Categories)

### CategoryDTO
```typescript
interface CategoryDTO {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### CategoryHierarchyDTO
```typescript
interface CategoryHierarchyDTO {
  id: string;
  name: string;
  description?: string;
  children: CategoryHierarchyDTO[];
  bookCount?: number;
}
```

## DTOs Communs

### AddressDTO
```typescript
interface AddressDTO {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
```

### PaymentMethodDTO
```typescript
interface PaymentMethodDTO {
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  cardNumber?: string; // Masqué pour la sécurité
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
}
```

### PaginationDTO
```typescript
interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### ApiResponseDTO<T>
```typescript
interface ApiResponseDTO<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationDTO;
}
```

### ValidationErrorDTO
```typescript
interface ValidationErrorDTO {
  field: string;
  message: string;
  code: string;
}