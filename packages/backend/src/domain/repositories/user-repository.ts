import { User, UserId } from '../entities/user';
import { Email } from '../value-objects/email';
import { UserRole } from '../value-objects/user-role';

export interface FindUsersOptions {
  limit?: number;
  offset?: number;
  role?: UserRole;
  search?: string;
}

export interface CountOptions {
  role?: UserRole;
}

export interface IUserRepository {
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