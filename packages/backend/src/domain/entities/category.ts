import { ValidationError } from '../errors';

export class CategoryId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Category ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CategoryId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export class Category {
  private readonly id: CategoryId;
  private name: string;
  private description: string;
  private parentId?: CategoryId;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: CategoryId,
    name: string,
    description: string,
    parentId?: CategoryId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateName(name);
    this.validateDescription(description);

    this.id = id;
    this.name = name;
    this.description = description;
    if(parentId) this.parentId = parentId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Category name cannot be empty');
    }
    if (name.length > 100) {
      throw new ValidationError('Category name cannot exceed 100 characters');
    }
  }

  private validateDescription(description: string): void {
    if (description && description.length > 500) {
      throw new ValidationError('Category description cannot exceed 500 characters');
    }
  }

  // Getters
  getId(): CategoryId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getParentId(): CategoryId | undefined {
    return this.parentId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateName(newName: string): void {
    this.validateName(newName);
    this.name = newName;
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string): void {
    this.validateDescription(newDescription);
    this.description = newDescription;
    this.updatedAt = new Date();
  }

  setParent(parentId: CategoryId | undefined): void {
    // Prevent circular references (would need repository check for full validation)
    if (parentId && parentId.equals(this.id)) {
      throw new ValidationError('Category cannot be its own parent');
    }
    if(parentId) parentId = parentId;
    this.updatedAt = new Date();
  }

  isRootCategory(): boolean {
    return !this.parentId;
  }

  hasParent(): boolean {
    return !!this.parentId;
  }

  equals(other: Category): boolean {
    return this.id.equals(other.id);
  }
}