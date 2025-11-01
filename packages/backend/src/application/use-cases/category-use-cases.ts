import { ICategoryRepository, IUnitOfWork, CategoryId, Category, FindCategoriesOptions } from "@/domain";
import { NotFoundError, ConflictError } from "@/domain/errors";
import { cacheService } from "@/infrastructure";
import { CreateCategoryDto, CategoryResponseDto, UpdateCategoryDto, CategorySearchDto, CategoryHierarchyDto } from "../dto";


// Commands
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(crypto.randomUUID());
    const parentId = dto.parentId ? new CategoryId(dto.parentId) : undefined;

    // Validate parent exists if provided
    if (parentId) {
      const parent = await this.categoryRepository.findById(parentId);
      if (!parent) {
        throw new NotFoundError('Parent category not found');
      }
    }

    const category = new Category(
      categoryId,
      dto.name,
      dto.description || '',
      parentId
    );

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getCategoryRepository();
      await repo.save(category);
      return this.mapToResponseDto(category);
    });

    // Invalidate categories cache
    await cacheService.invalidateCategoryCache();

    return result;
  }

  private mapToResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.getId().getValue(),
      name: category.getName(),
      description: category.getDescription(),
      parentId: category.getParentId()?.getValue()!,
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt()
    };
  }
}

export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(id);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (dto.name) category.updateName(dto.name);
    if (dto.description !== undefined) category.updateDescription(dto.description);
    if (dto.parentId !== undefined) {
      const parentId = dto.parentId ? new CategoryId(dto.parentId) : undefined;
      if (parentId) {
        const parent = await this.categoryRepository.findById(parentId);
        if (!parent) {
          throw new NotFoundError('Parent category not found');
        }
      }
      category.setParent(parentId);
    }

    const result = await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getCategoryRepository();
      await repo.update(category);
      return this.mapToResponseDto(category);
    });

    // Invalidate categories cache
    await cacheService.invalidateCategoryCache();

    return result;
  }

  private mapToResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.getId().getValue(),
      name: category.getName(),
      description: category.getDescription(),
      parentId: category.getParentId()?.getValue()!,
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt()
    };
  }
}

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(id: string): Promise<void> {
    const categoryId = new CategoryId(id);

    // Check if category has children
    const children = await this.categoryRepository.findByParentId(categoryId);
    if (children.length > 0) {
      throw new ConflictError('Cannot delete category with children');
    }

    await this.unitOfWork.executeInTransaction(async (uow) => {
      const repo = uow.getCategoryRepository();
      await repo.delete(categoryId);
    });

    // Invalidate categories cache
    await cacheService.invalidateCategoryCache();
  }
}

// Queries
export class GetCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<CategoryResponseDto | null> {
    const categoryId = new CategoryId(id);
    const category = await this.categoryRepository.findById(categoryId);
    return category ? this.mapToResponseDto(category) : null;
  }

  private mapToResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.getId().getValue(),
      name: category.getName(),
      description: category.getDescription(),
      parentId: category.getParentId()?.getValue()!,
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt()
    };
  }
}

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(dto: CategorySearchDto): Promise<CategoryResponseDto[]> {
    // Check cache for all categories if no filters
    if (!dto.parentId && !dto.search && dto.limit === 50 && dto.offset === 0) {
      const cachedCategories = await cacheService.getCategories();
      if (cachedCategories) {
        return cachedCategories;
      }
    }

    const options = {
      limit: dto.limit || 20,
      offset: dto.offset || 0,
      parentId: dto.parentId ? new CategoryId(dto.parentId) : null,
      search: dto.search
    };

    const categories = await this.categoryRepository.findAll(options as FindCategoriesOptions);
    const result = categories.map(category => this.mapToResponseDto(category));

    // Cache all categories
    if (!dto.parentId && !dto.search && dto.limit === 50 && dto.offset === 0) {
      await cacheService.setCategories(result);
    }

    return result;
  }

  private mapToResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.getId().getValue(),
      name: category.getName(),
      description: category.getDescription(),
      parentId: category.getParentId()?.getValue()!,
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt()
    };
  }
}

export class GetCategoryHierarchyUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<CategoryHierarchyDto[]> {
    const hierarchy = await this.categoryRepository.getHierarchy();
    return hierarchy;
  }
}