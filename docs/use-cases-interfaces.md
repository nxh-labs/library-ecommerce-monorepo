# Interfaces des Use Cases Principaux

## Use Cases pour les Livres (Books)

### GetBooksUseCase
```typescript
interface IGetBooksUseCase {
  execute(request: GetBooksRequest): Promise<GetBooksResponse>;
}

interface GetBooksRequest {
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

interface GetBooksResponse {
  books: BookDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### CreateBookUseCase
```typescript
interface ICreateBookUseCase {
  execute(request: CreateBookRequest): Promise<CreateBookResponse>;
}

interface CreateBookRequest {
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

interface CreateBookResponse {
  book: BookDTO;
}
```

### UpdateBookUseCase
```typescript
interface IUpdateBookUseCase {
  execute(bookId: string, request: UpdateBookRequest): Promise<UpdateBookResponse>;
}

interface UpdateBookRequest {
  title?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  coverImageUrl?: string;
}

interface UpdateBookResponse {
  book: BookDTO;
}
```

## Use Cases pour les Utilisateurs (Users)

### AuthenticateUserUseCase
```typescript
interface IAuthenticateUserUseCase {
  execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse>;
}

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}
```

### RegisterUserUseCase
```typescript
interface IRegisterUserUseCase {
  execute(request: RegisterUserRequest): Promise<RegisterUserResponse>;
}

interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterUserResponse {
  user: UserDTO;
}
```

## Use Cases pour les Commandes (Orders)

### CreateOrderUseCase
```typescript
interface ICreateOrderUseCase {
  execute(request: CreateOrderRequest): Promise<CreateOrderResponse>;
}

interface CreateOrderRequest {
  userId: string;
  cartId: string;
  shippingAddress: AddressDTO;
  billingAddress: AddressDTO;
  paymentMethod: PaymentMethodDTO;
}

interface CreateOrderResponse {
  order: OrderDTO;
  paymentUrl?: string;
}
```

### GetUserOrdersUseCase
```typescript
interface IGetUserOrdersUseCase {
  execute(userId: string, request: GetOrdersRequest): Promise<GetOrdersResponse>;
}

interface GetOrdersRequest {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
}

interface GetOrdersResponse {
  orders: OrderDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Use Cases pour le Panier (Cart)

### AddToCartUseCase
```typescript
interface IAddToCartUseCase {
  execute(request: AddToCartRequest): Promise<AddToCartResponse>;
}

interface AddToCartRequest {
  userId: string;
  bookId: string;
  quantity: number;
}

interface AddToCartResponse {
  cart: CartDTO;
}
```

### GetCartUseCase
```typescript
interface IGetCartUseCase {
  execute(userId: string): Promise<GetCartResponse>;
}

interface GetCartResponse {
  cart: CartDTO;
}
```

## Use Cases pour les Avis (Reviews)

### CreateReviewUseCase
```typescript
interface ICreateReviewUseCase {
  execute(request: CreateReviewRequest): Promise<CreateReviewResponse>;
}

interface CreateReviewRequest {
  userId: string;
  bookId: string;
  rating: number;
  comment?: string;
}

interface CreateReviewResponse {
  review: ReviewDTO;
}
```

### GetBookReviewsUseCase
```typescript
interface IGetBookReviewsUseCase {
  execute(bookId: string, request: GetReviewsRequest): Promise<GetReviewsResponse>;
}

interface GetReviewsRequest {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

interface GetReviewsResponse {
  reviews: ReviewDTO[];
  averageRating: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Use Cases pour les Catégories (Categories)

### GetCategoriesUseCase
```typescript
interface IGetCategoriesUseCase {
  execute(request: GetCategoriesRequest): Promise<GetCategoriesResponse>;
}

interface GetCategoriesRequest {
  parentId?: string | null;
  includeHierarchy?: boolean;
}

interface GetCategoriesResponse {
  categories: CategoryDTO[];
  hierarchy?: CategoryHierarchyDTO[];
}