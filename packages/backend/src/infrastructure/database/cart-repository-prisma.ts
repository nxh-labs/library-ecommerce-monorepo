import { ICartRepository, CartId, UserId, CartItemId, Cart, CartItem } from '@/domain';
import {  PrismaClient } from '@prisma/client';

export class CartRepositoryPrisma implements ICartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: CartId): Promise<Cart | null> {
    const cartData = await this.prisma.cart.findUnique({
      where: { id: id.getValue() },
      include: { items: true },
    });

    if (!cartData) return null;

    return this.mapToDomain(cartData);
  }

  async findByUserId(userId: UserId): Promise<Cart | null> {
    const cartData = await this.prisma.cart.findUnique({
      where: { userId: userId.getValue() },
      include: { items: true },
    });

    if (!cartData) return null;

    return this.mapToDomain(cartData);
  }

  async findItems(cartId: CartId): Promise<CartItem[]> {
    const itemsData = await this.prisma.cartItem.findMany({
      where: { cartId: cartId.getValue() },
      orderBy: { addedAt: 'desc' },
    });

    return itemsData.map(itemData => this.mapItemToDomain(itemData));
  }

  async save(cart: Cart): Promise<void> {
    const data = this.mapToPrisma(cart);

    await this.prisma.cart.upsert({
      where: { id: cart.getId().getValue() },
      update: data,
      create: data,
    });
  }

  async update(cart: Cart): Promise<void> {
    const data = this.mapToPrisma(cart);

    await this.prisma.cart.update({
      where: { id: cart.getId().getValue() },
      data,
    });
  }

  async delete(id: CartId): Promise<void> {
    await this.prisma.cart.delete({
      where: { id: id.getValue() },
    });
  }

  async addItem(cartId: CartId, item: CartItem): Promise<void> {
    await this.prisma.cartItem.upsert({
      where: {
        cartId_bookId: {
          cartId: cartId.getValue(),
          bookId: item.getBookId(),
        },
      },
      update: {
        quantity: item.getQuantity(),
      },
      create: {
        id: item.getId().getValue(),
        cartId: cartId.getValue(),
        bookId: item.getBookId(),
        quantity: item.getQuantity(),
        addedAt: item.getAddedAt(),
      },
    });
  }

  async updateItem(cartId: CartId, itemId: CartItemId, quantity: number): Promise<void> {
    await this.prisma.cartItem.update({
      where: { id: itemId.getValue() },
      data: { quantity },
    });
  }

  async removeItem(cartId: CartId, itemId: CartItemId): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { id: itemId.getValue() },
    });
  }

  async clear(cartId: CartId): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cartId.getValue() },
    });
  }

  private mapToDomain(cartData: any): Cart {
    const items = cartData.items.map((itemData: any) =>
      this.mapItemToDomain(itemData)
    );

    return new Cart(
      new CartId(cartData.id),
      new UserId(cartData.userId),
      items,
      cartData.createdAt,
      cartData.updatedAt
    );
  }

  private mapItemToDomain(itemData: any): CartItem {
    return new CartItem(
      new CartItemId(itemData.id),
      itemData.bookId,
      itemData.quantity,
      itemData.addedAt
    );
  }

  private mapToPrisma(cart: Cart): any {
    return {
      id: cart.getId().getValue(),
      userId: cart.getUserId().getValue(),
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt(),
      items: {
        upsert: cart.getItems().map(item => ({
          where: {
            cartId_bookId: {
              cartId: cart.getId().getValue(),
              bookId: item.getBookId(),
            },
          },
          update: {
            quantity: item.getQuantity(),
          },
          create: {
            id: item.getId().getValue(),
            bookId: item.getBookId(),
            quantity: item.getQuantity(),
            addedAt: item.getAddedAt(),
          },
        })),
      },
    };
  }
}