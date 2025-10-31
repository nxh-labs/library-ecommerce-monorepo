import { Order } from '../../domain/entities/order';
import { OrderResponseDto } from '../../application/dto/order-dto';

export class OrderMapper {
  static toResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.getId().getValue(),
      userId: order.getUserId().getValue(),
      status: order.getStatus().getValue(),
      items: order.getItems().map(item => ({
        bookId: item.getBookId(),
        quantity: item.getQuantity(),
        unitPrice: item.getUnitPrice().getValue(),
        totalPrice: item.getTotalPrice().getValue()
      })),
      shippingAddress: order.getShippingAddress(),
      billingAddress: order.getBillingAddress(),
      totalAmount: order.getTotalAmount().getValue(),
      orderDate: order.getOrderDate(),
      updatedAt: order.getUpdatedAt()
    };
  }

  static toResponseDtoList(orders: Order[]): OrderResponseDto[] {
    return orders.map(order => this.toResponseDto(order));
  }
}