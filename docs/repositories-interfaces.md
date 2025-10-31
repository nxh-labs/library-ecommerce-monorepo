# Interfaces des Repositories

## IBookRepository

```typescript
interface IBookRepository {
  // Queries
  findById(id: BookId): Promise<Book | null>;
  findByIsbn(isbn: ISBN): Promise<Book | null>;
  findAll(options: FindBooksOptions): Promise<Book[]>;
  findByCategory(categoryId: CategoryId): Promise<Book[]>;
  search(query: string, options: SearchOptions): Promise<Book[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(id: BookId): Promise<void>;
  updateStock(id: BookId, newStock: number): Promise<void>;
}

interface FindBooksOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'title' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  categoryId?: CategoryId;
  priceRange?: { min: number; max: number };
  inStock?: boolean;
}

interface SearchOptions extends FindBooksOptions {
  query: string;
  fields?: ('title' | 'author' | 'description')[];
}
```

## IUserRepository

```typescript
interface IUserRepository {
  // Queries
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(options: FindUsersOptions): Promise<User[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  updateLastLogin(id: UserId): Promise<void>;
}

interface FindUsersOptions {
  limit?: number;
  offset?: number;
  role?: UserRole;
  search?: string;
}
```

## IOrderRepository

```typescript
interface IOrderRepository {
  // Queries
  findById(id: OrderId): Promise<Order | null>;
  findByUserId(userId: UserId, options: FindOrdersOptions): Promise<Order[]>;
  findAll(options: FindOrdersOptions): Promise<Order[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  updateStatus(id: OrderId, status: OrderStatus): Promise<void>;
}

interface FindOrdersOptions {
  limit?: number;
  offset?: number;
  status?: OrderStatus;
  dateRange?: { start: Date; end: Date };
  userId?: UserId;
}
```

## IReviewRepository

```typescript
interface IReviewRepository {
  // Queries
  findById(id: ReviewId): Promise<Review | null>;
  findByBookId(bookId: BookId, options: FindReviewsOptions): Promise<Review[]>;
  findByUserId(userId: UserId, options: FindReviewsOptions): Promise<Review[]>;
  getAverageRating(bookId: BookId): Promise<number>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(review: Review): Promise<void>;
  update(review: Review): Promise<void>;
  delete(id: ReviewId): Promise<void>;
}

interface FindReviewsOptions {
  limit?: number;
  offset?: number;
  rating?: number;
  sortBy?: 'createdAt' | 'rating';
}
```

## ICategoryRepository

```typescript
interface ICategoryRepository {
  // Queries
  findById(id: CategoryId): Promise<Category | null>;
  findAll(options: FindCategoriesOptions): Promise<Category[]>;
  findByParentId(parentId: CategoryId | null): Promise<Category[]>;
  getHierarchy(): Promise<CategoryHierarchy[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: CategoryId): Promise<void>;
}

interface FindCategoriesOptions {
  limit?: number;
  offset?: number;
  parentId?: CategoryId | null;
  search?: string;
}
```

## ICartRepository

```typescript
interface ICartRepository {
  // Queries
  findById(id: CartId): Promise<Cart | null>;
  findByUserId(userId: UserId): Promise<Cart | null>;
  findItems(cartId: CartId): Promise<CartItem[]>;

  // Commands
  save(cart: Cart): Promise<void>;
  update(cart: Cart): Promise<void>;
  delete(id: CartId): Promise<void>;
  addItem(cartId: CartId, item: CartItem): Promise<void>;
  updateItem(cartId: CartId, itemId: CartItemId, quantity: number): Promise<void>;
  removeItem(cartId: CartId, itemId: CartItemId): Promise<void>;
  clear(cartId: CartId): Promise<void>;
}
```

## IUnitOfWork

```typescript
interface IUnitOfWork {
  // Transaction management
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  // Repository access within transaction
  getBookRepository(): IBookRepository;
  getUserRepository(): IUserRepository;
  getOrderRepository(): IOrderRepository;
  getReviewRepository(): IReviewRepository;
  getCategoryRepository(): ICategoryRepository;
  getCartRepository(): ICartRepository;
}