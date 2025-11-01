import { ICartRepository, IBookRepository, IUnitOfWork, UserId, BookId, CartId, Cart } from "@/domain";
import { AddToCartDto, CartResponseDto, UpdateCartItemDto, CartSummaryDto } from "../dto";


// Commands
export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly bookRepository: IBookRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, dto: AddToCartDto): Promise<CartResponseDto> {
    const userIdObj = new UserId(userId);
    const bookId = new BookId(dto.bookId);

    // Verify book exists and is in stock
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    if (!book.isInStock()) {
      throw new Error('Book is out of stock');
    }

    // Get or create cart
    let cart = await this.cartRepository.findByUserId(userIdObj);
    if (!cart) {
      const cartId = new CartId(crypto.randomUUID());
      cart = new Cart(cartId, userIdObj);
    }

    // Add item to cart
    const updatedCart = cart.addItem(dto.bookId, dto.quantity);

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const cartRepo = uow.getCartRepository();
      await cartRepo.save(updatedCart);
      return this.mapToResponseDto(updatedCart);
    });
    return result;
  }

  private mapToResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.getId().getValue(),
      userId: cart.getUserId().getValue(),
      items: cart.getItems().map(item => ({
        id: item.getId().getValue(),
        bookId: item.getBookId(),
        quantity: item.getQuantity(),
        addedAt: item.getAddedAt()
      })),
      totalItems: cart.getTotalItems(),
      estimatedTotalPrice: 0, // Would need book prices
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt()
    };
  }
}

export class UpdateCartItemUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<CartResponseDto> {
    const userIdObj = new UserId(userId);
    const cart = await this.cartRepository.findByUserId(userIdObj);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const updatedCart = cart.updateItemQuantity(itemId, dto.quantity);

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const cartRepo = uow.getCartRepository();
      await cartRepo.save(updatedCart);
      return this.mapToResponseDto(updatedCart);
    });
    return result;
  }

  private mapToResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.getId().getValue(),
      userId: cart.getUserId().getValue(),
      items: cart.getItems().map(item => ({
        id: item.getId().getValue(),
        bookId: item.getBookId(),
        quantity: item.getQuantity(),
        addedAt: item.getAddedAt()
      })),
      totalItems: cart.getTotalItems(),
      estimatedTotalPrice: 0, // Would need book prices
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt()
    };
  }
}

export class RemoveFromCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, bookId: string): Promise<CartResponseDto> {
    const userIdObj = new UserId(userId);
    const cart = await this.cartRepository.findByUserId(userIdObj);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const updatedCart = cart.removeItem(bookId);

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const cartRepo = uow.getCartRepository();
      await cartRepo.save(updatedCart);
      return this.mapToResponseDto(updatedCart);
    });
    return result;
  }

  private mapToResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.getId().getValue(),
      userId: cart.getUserId().getValue(),
      items: cart.getItems().map(item => ({
        id: item.getId().getValue(),
        bookId: item.getBookId(),
        quantity: item.getQuantity(),
        addedAt: item.getAddedAt()
      })),
      totalItems: cart.getTotalItems(),
      estimatedTotalPrice: 0, // Would need book prices
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt()
    };
  }
}

export class ClearCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string): Promise<void> {
    const userIdObj = new UserId(userId);
    const cart = await this.cartRepository.findByUserId(userIdObj);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const clearedCart = cart.clear();

    await this.unitOfWork.executeInTransaction(async (uow) => {
      const cartRepo = uow.getCartRepository();
      await cartRepo.save(clearedCart);
    });
  }
}

// Queries
export class GetCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<CartResponseDto | null> {
    const userIdObj = new UserId(userId);
    const cart = await this.cartRepository.findByUserId(userIdObj);
    return cart ? this.mapToResponseDto(cart) : null;
  }

  private mapToResponseDto(cart: Cart): CartResponseDto {
    return {
      id: cart.getId().getValue(),
      userId: cart.getUserId().getValue(),
      items: cart.getItems().map(item => ({
        id: item.getId().getValue(),
        bookId: item.getBookId(),
        quantity: item.getQuantity(),
        addedAt: item.getAddedAt()
      })),
      totalItems: cart.getTotalItems(),
      estimatedTotalPrice: 0, // Would need book prices
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt()
    };
  }
}

export class GetCartSummaryUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<CartSummaryDto> {
    const userIdObj = new UserId(userId);
    const cart = await this.cartRepository.findByUserId(userIdObj);

    if (!cart) {
      return {
        totalItems: 0,
        totalUniqueItems: 0,
        estimatedTotalPrice: 0
      };
    }

    return {
      totalItems: cart.getTotalItems(),
      totalUniqueItems: cart.getUniqueItemsCount(),
      estimatedTotalPrice: 0 // Would need book prices
    };
  }
}