import { Email } from '../value-objects/email';
import { UserRoleValue } from '../value-objects/user-role';

export class UserId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class User {
  private readonly id: UserId;
  private readonly email: Email;
  private passwordHash: string;
  private firstName: string;
  private lastName: string;
  private readonly role: UserRoleValue;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private lastLoginAt?: Date;

  constructor(
    id: UserId,
    email: Email,
    passwordHash: string,
    firstName: string,
    lastName: string,
    role: UserRoleValue,
    createdAt?: Date,
    updatedAt?: Date,
    lastLoginAt?: Date
  ) {
    this.validatePasswordHash(passwordHash);
    this.validateName(firstName, 'firstName');
    this.validateName(lastName, 'lastName');

    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    if(lastLoginAt) this.lastLoginAt = lastLoginAt;
  }

  private validatePasswordHash(passwordHash: string): void {
    if (!passwordHash || passwordHash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
  }

  private validateName(name: string, fieldName: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    if (name.length > 100) {
      throw new Error(`${fieldName} cannot exceed 100 characters`);
    }
  }

  // Getters
  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getRole(): UserRoleValue {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getLastLoginAt(): Date | undefined {
    return this.lastLoginAt;
  }

  // Business methods
  updatePassword(newPasswordHash: string): void {
    this.validatePasswordHash(newPasswordHash);
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }

  updateName(firstName: string, lastName: string): void {
    this.validateName(firstName, 'firstName');
    this.validateName(lastName, 'lastName');
    this.firstName = firstName;
    this.lastName = lastName;
    this.updatedAt = new Date();
  }

  updateFirstName(newFirstName: string): void {
    this.validateName(newFirstName, 'firstName');
    this.firstName = newFirstName;
    this.updatedAt = new Date();
  }

  updateLastName(newLastName: string): void {
    this.validateName(newLastName, 'lastName');
    this.lastName = newLastName;
    this.updatedAt = new Date();
  }

  recordLogin(): void {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  canAccessAdminFeatures(): boolean {
    return this.role.isAdmin();
  }

  canManageUsers(): boolean {
    return this.role.canManageUsers();
  }

  canManageBooks(): boolean {
    return this.role.canManageBooks();
  }

  canManageOrders(): boolean {
    return this.role.canManageOrders();
  }

  equals(other: User): boolean {
    return this.id.equals(other.id);
  }
}