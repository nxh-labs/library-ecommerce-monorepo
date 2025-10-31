import { Category } from '../../domain/entities/category';
import { CategoryResponseDto, CategoryHierarchyDto } from '../../application/dto/category-dto';

export class CategoryMapper {
  static toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.getId().getValue(),
      name: category.getName(),
      description: category.getDescription(),
      parentId: category.getParentId()?.getValue(),
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt()
    };
  }

  static toResponseDtoList(categories: Category[]): CategoryResponseDto[] {
    return categories.map(category => this.toResponseDto(category));
  }

  static toHierarchyDto(hierarchy: any[]): CategoryHierarchyDto[] {
    return hierarchy.map(item => ({
      id: item.id,
      name: item.name,
      children: item.children ? this.toHierarchyDto(item.children) : []
    }));
  }
}