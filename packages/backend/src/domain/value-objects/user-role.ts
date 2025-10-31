export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MANAGER = 'manager'
}

export class UserRoleValue {
  private readonly value: UserRole;

  constructor(value: UserRole) {
    this.value = value;
  }

  getValue(): UserRole {
    return this.value;
  }

  isAdmin(): boolean {
    return this.value === UserRole.ADMIN;
  }

  isManager(): boolean {
    return this.value === UserRole.MANAGER || this.value === UserRole.ADMIN;
  }

  isCustomer(): boolean {
    return this.value === UserRole.CUSTOMER;
  }

  canManageUsers(): boolean {
    return this.isManager();
  }

  canManageBooks(): boolean {
    return this.isManager();
  }

  canManageOrders(): boolean {
    return this.isManager();
  }

  equals(other: UserRoleValue): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}