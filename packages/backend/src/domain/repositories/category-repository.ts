import { Category, CategoryId } from '../entities/category';

export interface CategoryHierarchy {
  id: string;
  name: string;
  children: CategoryHierarchy[];
}

export interface FindCategoriesOptions {
  limit?: number;
  offset?: number;
  parentId?: CategoryId | null;
  search?: string;
}

export interface CountOptions {
  parentId?: CategoryId | null;
}

export interface ICategoryRepository {
  // Queries
  findById(id: CategoryId): Promise<Category | null>;
  findAll(options: FindCategoriesOptions): Promise<Category[]>;
  findByParentId(parentId: CategoryId | null): Promise<Category[]>;
  getHierarchy(): Promise<CategoryHierarchy[]>;
  count(options: CountOptions): Promise<number>;

  // Commands
  save(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: CategoryId): Promise<void>;
}