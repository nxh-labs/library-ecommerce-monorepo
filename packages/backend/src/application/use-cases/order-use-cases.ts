import { IOrderRepository, IBookRepository, ICartRepository, IUnitOfWork, UserId, OrderItem, BookId, Price, OrderId, OrderStatusValue, OrderStatus, Order, FindOrdersOptions } from "@/domain";
import { CreateOrderDto, OrderResponseDto, UpdateOrderStatusDto, UpdateOrderAddressDto, OrderSearchDto } from "../dto";


// Commands
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly bookRepository: IBookRepository,
    private readonly cartRepository: ICartRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
    const userIdObj = new UserId(userId);

    // Validate stock availability and calculate prices
    const orderItems: OrderItem[] = [];
    for (const item of dto.items) {
      const book = await this.bookRepository.findById(new BookId(item.bookId));
      if (!book) {
        throw new Error(`Book ${item.bookId} not found`);
      }
      if (!book.hasEnoughStock(item.quantity)) {
        throw new Error(`Insufficient stock for book ${book.getTitle()}`);
      }

      const orderItem = new OrderItem(
        item.bookId,
        item.quantity,
        new Price(item.unitPrice)
      );
      orderItems.push(orderItem);
    }

    const orderId = new OrderId(crypto.randomUUID());
    const status = new OrderStatusValue(OrderStatus.PENDING);

    const order = new Order(
      orderId,
      userIdObj,
      status,
      orderItems,
      dto.shippingAddress,
      dto.billingAddress
    );

    await this.unitOfWork.beginTransaction();
    try {
      // Decrease stock for each book
      for (const item of dto.items) {
        await this.bookRepository.updateStock(
          new BookId(item.bookId),
          (await this.bookRepository.findById(new BookId(item.bookId)))!.getStockQuantity() - item.quantity
        );
      }

      await this.orderRepository.save(order);

      // Clear user's cart if it exists
      const cart = await this.cartRepository.findByUserId(userIdObj);
      if (cart) {
        await this.cartRepository.clear(cart.getId());
      }

      await this.unitOfWork.commit();
      return this.mapToResponseDto(order);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
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
}

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const orderId = new OrderId(id);
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const newStatus = new OrderStatusValue(dto.status);

    // Business rule validation
    if (order.getStatus().getValue() === OrderStatus.CANCELLED) {
      throw new Error('Cannot update cancelled order');
    }

    if (order.getStatus().getValue() === OrderStatus.DELIVERED &&
        dto.status !== OrderStatus.REFUNDED) {
      throw new Error('Can only refund delivered orders');
    }

    await this.unitOfWork.beginTransaction();
    try {
      await this.orderRepository.updateStatus(orderId, newStatus.getValue());
      await this.unitOfWork.commit();

      // Re-fetch order to get updated status
      const updatedOrder = await this.orderRepository.findById(orderId);
      return this.mapToResponseDto(updatedOrder!);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
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
}

export class UpdateOrderAddressUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, dto: UpdateOrderAddressDto): Promise<OrderResponseDto> {
    const orderId = new OrderId(id);
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Only allow address updates for pending orders
    if (!order.canBeCancelled()) {
      throw new Error('Cannot update address for orders that are being processed');
    }

    if (dto.shippingAddress) {
      order.updateShippingAddress(dto.shippingAddress);
    }
    if (dto.billingAddress) {
      order.updateBillingAddress(dto.billingAddress);
    }

    await this.unitOfWork.beginTransaction();
    try {
      await this.orderRepository.update(order);
      await this.unitOfWork.commit();
      return this.mapToResponseDto(order);
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
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
}

// Queries
export class GetOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<OrderResponseDto | null> {
    const orderId = new OrderId(id);
    const order = await this.orderRepository.findById(orderId);
    return order ? this.mapToResponseDto(order) : null;
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
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
}

export class GetUserOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(userId: string, dto: OrderSearchDto): Promise<OrderResponseDto[]> {
    const userIdObj = new UserId(userId);
    const options = {
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      status: dto.status,
      dateRange: dto.dateFrom && dto.dateTo ? {
        start: new Date(dto.dateFrom),
        end: new Date(dto.dateTo)
      } : undefined,
      userId: userIdObj
    };

    const orders = await this.orderRepository.findByUserId(userIdObj, options as FindOrdersOptions);
    return orders.map(order => this.mapToResponseDto(order));
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
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
}