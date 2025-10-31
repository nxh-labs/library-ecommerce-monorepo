import { ICategoryRepository, CategoryId, FindCategoriesOptions, CategoryHierarchy, Category } from '@/domain';
import { CountOptions } from '@/domain/repositories/category-repository';
import {  PrismaClient } from '@prisma/client';

export class CategoryRepositoryPrisma implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: CategoryId): Promise<Category | null> {
    const categoryData = await this.prisma.category.findUnique({
      where: { id: id.getValue() },
    });

    if (!categoryData) return null;

    return this.mapToDomain(categoryData);
  }

  async findAll(options: FindCategoriesOptions): Promise<Category[]> {
    const where: any = {};

    if (options.parentId !== undefined) {
      where.parentId = options.parentId?.getValue() || null;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const query: any = {
      where,
      orderBy: { name: 'asc' },
    };

    if (options.offset !== undefined) {
      query.skip = options.offset;
    }

    if (options.limit !== undefined) {
      query.take = options.limit;
    }

    const categoriesData = await this.prisma.category.findMany(query);

    return categoriesData.map(categoryData => this.mapToDomain(categoryData));
  }

  async findByParentId(parentId: CategoryId | null): Promise<Category[]> {
    const categoriesData = await this.prisma.category.findMany({
      where: { parentId: parentId?.getValue() || null },
      orderBy: { name: 'asc' },
    });

    return categoriesData.map(categoryData => this.mapToDomain(categoryData));
  }

  async getHierarchy(): Promise<CategoryHierarchy[]> {
    const categoriesData = await this.prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true, // Support for 2 levels of nesting
          },
        },
      },
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });

    return categoriesData.map(categoryData => this.mapToHierarchy(categoryData));
  }

  async count(options:CountOptions): Promise<number> {
    const where: any = {};

    if (options.parentId !== undefined) {
      where.parentId = options.parentId?.getValue() || null;
    }

    return await this.prisma.category.count({ where });
  }

  async save(category: Category): Promise<void> {
    const data = this.mapToPrisma(category);

    await this.prisma.category.upsert({
      where: { id: category.getId().getValue() },
      update: data,
      create: data,
    });
  }

  async update(category: Category): Promise<void> {
    const data = this.mapToPrisma(category);

    await this.prisma.category.update({
      where: { id: category.getId().getValue() },
      data,
    });
  }

  async delete(id: CategoryId): Promise<void> {
    await this.prisma.category.delete({
      where: { id: id.getValue() },
    });
  }

  private mapToHierarchy(categoryData: any): CategoryHierarchy {
    return {
      id: categoryData.id,
      name: categoryData.name,
      children: categoryData.children?.map((child: any) => ({
        id: child.id,
        name: child.name,
        children: child.children?.map((grandChild: any) => ({
          id: grandChild.id,
          name: grandChild.name,
          children: [],
        })) || [],
      })) || [],
    };
  }

  private mapToDomain(categoryData: any): Category {
    return new Category(
      new CategoryId(categoryData.id),
      categoryData.name,
      categoryData.description || '',
      categoryData.parentId ? new CategoryId(categoryData.parentId) : undefined,
      categoryData.createdAt,
      categoryData.updatedAt
    );
  }

  private mapToPrisma(category: Category): any {
    return {
      id: category.getId().getValue(),
      name: category.getName(),
      description: category.getDescription(),
      parentId: category.getParentId()?.getValue(),
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt(),
    };
  }
}