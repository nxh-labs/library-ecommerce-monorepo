import { IOrderRepository, OrderId, UserId, FindOrdersOptions, OrderItem, Price, Order, OrderStatusValue, OrderStatus } from '@/domain';
import { CountOptions } from '@/domain/repositories/order-repository';
import {   PrismaClient } from '@prisma/client';

export class OrderRepositoryPrisma implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: OrderId): Promise<Order | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { id: id.getValue() },
      include: {
        items: {
          include: {
            book: true, // Include book details to avoid N+1 queries
          },
        },
        user: true, // Include user details if needed
      },
    });

    if (!orderData) return null;

    return this.mapToDomain(orderData);
  }

  async findByUserId(userId: UserId, options: FindOrdersOptions): Promise<Order[]> {
    const where: any = { userId: userId.getValue() };

    if (options.status) {
      where.status = options.status;
    }

    if (options.dateRange) {
      where.orderDate = {
        gte: options.dateRange.start,
        lte: options.dateRange.end,
      };
    }

    const query: any = {
      where,
      include: {
        items: {
          include: {
            book: true, // Include book details to avoid N+1 queries
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    };

    if (options.offset !== undefined) {
      query.skip = options.offset;
    }

    if (options.limit !== undefined) {
      query.take = options.limit;
    }

    const ordersData = await this.prisma.order.findMany(query);

    return ordersData.map(orderData => this.mapToDomain(orderData));
  }

  async findAll(options: FindOrdersOptions): Promise<Order[]> {
    const where: any = {};

    if (options.status) {
      where.status = options.status;
    }

    if (options.userId) {
      where.userId = options.userId.getValue();
    }

    if (options.dateRange) {
      where.orderDate = {
        gte: options.dateRange.start,
        lte: options.dateRange.end,
      };
    }

    const query: any = {
      where,
      include: {
        items: {
          include: {
            book: true, // Include book details to avoid N+1 queries
          },
        },
        user: true, // Include user details if needed
      },
      orderBy: { orderDate: 'desc' },
    };

    if (options.offset !== undefined) {
      query.skip = options.offset;
    }

    if (options.limit !== undefined) {
      query.take = options.limit;
    }

    const ordersData = await this.prisma.order.findMany(query);

    return ordersData.map(orderData => this.mapToDomain(orderData));
  }

  async count(options: CountOptions): Promise<number> {
    const where: any = {};

    if (options.status) {
      where.status = options.status;
    }

    if (options.userId) {
      where.userId = options.userId.getValue();
    }

    return await this.prisma.order.count({ where });
  }

  async save(order: Order): Promise<void> {
    const data = this.mapToPrisma(order);

    await this.prisma.order.upsert({
      where: { id: order.getId().getValue() },
      update: data,
      create: data,
    });
  }

  async update(order: Order): Promise<void> {
    const data = this.mapToPrisma(order);

    await this.prisma.order.update({
      where: { id: order.getId().getValue() },
      data,
    });
  }

  async updateStatus(id: OrderId, status: OrderStatus): Promise<void> {
    await this.prisma.order.update({
      where: { id: id.getValue() },
      data: { status: status as any, updatedAt: new Date() },
    });
  }

  private mapToDomain(orderData: any): Order {
    const items = orderData.items.map((itemData: any) =>
      new OrderItem(itemData.bookId, itemData.quantity, new Price(itemData.unitPrice))
    );

    return new Order(
      new OrderId(orderData.id),
      new UserId(orderData.userId),
      new OrderStatusValue(orderData.status as OrderStatus),
      items,
      orderData.shippingAddress,
      orderData.billingAddress,
      orderData.orderDate,
      orderData.updatedAt
    );
  }

  private mapToPrisma(order: Order): any {
    return {
      id: order.getId().getValue(),
      userId: order.getUserId().getValue(),
      status: order.getStatus().getValue(),
      shippingAddress: order.getShippingAddress(),
      billingAddress: order.getBillingAddress(),
      orderDate: order.getOrderDate(),
      updatedAt: order.getUpdatedAt(),
      items: {
        upsert: order.getItems().map(item => ({
          where: {
            id: `${order.getId().getValue()}-${item.getBookId()}`,
          },
          update: {
            quantity: item.getQuantity(),
            unitPrice: item.getUnitPrice().getValue(),
          },
          create: {
            id: `${order.getId().getValue()}-${item.getBookId()}`,
            bookId: item.getBookId(),
            quantity: item.getQuantity(),
            unitPrice: item.getUnitPrice().getValue(),
          },
        })),
      },
    };
  }
}