import { Cart, CartId, CartItem, CartItemId } from '../entities/cart';
import { UserId } from '../entities/user';

export interface ICartRepository {
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