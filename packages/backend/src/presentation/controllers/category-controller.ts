import { CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, GetCategoriesUseCase, GetCategoryHierarchyUseCase, CreateCategoryDto, UpdateCategoryDto, CategorySearchDto } from '@/application';
import { AuthenticatedRequest } from '@/infrastructure';
import { Request, Response, NextFunction } from 'express';


export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryHierarchyUseCase: GetCategoryHierarchyUseCase
  ) {}

  async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateCategoryDto = req.body;
      const category = await this.createCategoryUseCase.execute(dto);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }
      const dto: UpdateCategoryDto = req.body;
      const category = await this.updateCategoryUseCase.execute(id, dto);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }
      await this.deleteCategoryUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }
      const category = await this.getCategoryUseCase.execute(id);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CategorySearchDto = req.query as any;
      const categories = await this.getCategoriesUseCase.execute(dto);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryHierarchy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hierarchy = await this.getCategoryHierarchyUseCase.execute();
      res.json(hierarchy);
    } catch (error) {
      next(error);
    }
  }
}