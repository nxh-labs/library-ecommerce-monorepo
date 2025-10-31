import { Cart } from '../../domain/entities/cart';
import { CartResponseDto, CartSummaryDto } from '../../application/dto/cart-dto';

export class CartMapper {
  static toResponseDto(cart: Cart): CartResponseDto {
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
      estimatedTotalPrice: 0, // Would need book prices from service
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt()
    };
  }

  static toSummaryDto(cart: Cart | null): CartSummaryDto {
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
      estimatedTotalPrice: 0 // Would need book prices from service
    };
  }
}