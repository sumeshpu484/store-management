import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category, CategoryResponse, CategoryStats } from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices, gadgets, and accessories',
      isActive: true,
      totalProducts: 45,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 2,
      name: 'Food & Beverages',
      description: 'Food items, drinks, and consumables',
      isActive: true,
      totalProducts: 120,
      createdAt: '2024-01-04T13:00:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 3,
      name: 'Clothing',
      description: 'Apparel, fashion, and accessories',
      isActive: true,
      totalProducts: 80,
      createdAt: '2024-01-07T16:00:00Z',
      updatedAt: '2024-01-21T12:45:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 4,
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      isActive: true,
      totalProducts: 65,
      createdAt: '2024-01-08T17:00:00Z',
      updatedAt: '2024-01-22T15:30:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 5,
      name: 'Sports & Fitness',
      description: 'Sports equipment and fitness accessories',
      isActive: false,
      totalProducts: 30,
      createdAt: '2024-01-09T18:00:00Z',
      updatedAt: '2024-01-23T09:45:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ];

  private nextCategoryId = 10;

  getCategories(): Observable<CategoryResponse> {
    return of({
      success: true,
      message: 'Categories retrieved successfully',
      categories: [...this.categories]
    }).pipe(delay(300));
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    const category = this.categories.find(c => c.id === id);
    return of({
      success: !!category,
      message: category ? 'Category found' : 'Category not found',
      category: category
    }).pipe(delay(200));
  }

  getParentCategories(): Observable<CategoryResponse> {
    const activeCategories = this.categories.filter(c => c.isActive);
    return of({
      success: true,
      message: 'Categories retrieved successfully',
      categories: activeCategories
    }).pipe(delay(200));
  }

  getCategoryStats(): Observable<{ success: boolean; stats: CategoryStats }> {
    const stats: CategoryStats = {
      totalCategories: this.categories.length,
      activeCategories: this.categories.filter(c => c.isActive).length,
      inactiveCategories: this.categories.filter(c => !c.isActive).length,
      totalProducts: this.categories.reduce((sum, c) => sum + (c.totalProducts || 0), 0)
    };

    return of({
      success: true,
      stats
    }).pipe(delay(200));
  }

  createCategory(category: Category): Observable<CategoryResponse> {
    // Validate required fields
    if (!category.name) {
      return of({
        success: false,
        message: 'Name is required'
      }).pipe(delay(200));
    }

    const newCategory: Category = {
      ...category,
      id: this.nextCategoryId++,
      isActive: category.isActive ?? true,
      totalProducts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      updatedBy: 'current-user'
    };

    this.categories.push(newCategory);

    return of({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    }).pipe(delay(500));
  }

  updateCategory(id: number, category: Category): Observable<CategoryResponse> {
    const index = this.categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Category not found'
      }).pipe(delay(200));
    }

    const updatedCategory: Category = {
      ...this.categories[index],
      ...category,
      id: id,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user'
    };

    this.categories[index] = updatedCategory;

    return of({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    }).pipe(delay(500));
  }

  deleteCategory(id: number): Observable<CategoryResponse> {
    const category = this.categories.find(c => c.id === id);
    
    if (!category) {
      return of({
        success: false,
        message: 'Category not found'
      }).pipe(delay(200));
    }

    // Check if category has products
    if (category.totalProducts && category.totalProducts > 0) {
      return of({
        success: false,
        message: `Cannot delete category that has ${category.totalProducts} products. Please move or delete products first.`
      }).pipe(delay(200));
    }

    const index = this.categories.findIndex(c => c.id === id);
    this.categories.splice(index, 1);

    return of({
      success: true,
      message: 'Category deleted successfully'
    }).pipe(delay(500));
  }

  toggleCategoryStatus(id: number): Observable<CategoryResponse> {
    const category = this.categories.find(c => c.id === id);
    
    if (!category) {
      return of({
        success: false,
        message: 'Category not found'
      }).pipe(delay(200));
    }

    category.isActive = !category.isActive;
    category.updatedAt = new Date().toISOString();
    category.updatedBy = 'current-user';

    return of({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category: category
    }).pipe(delay(300));
  }

  generateCategoryCode(name: string): string {
    // No longer needed since we removed codes
    return '';
  }

  reorderCategories(categoryIds: number[]): Observable<CategoryResponse> {
    // No longer needed since we removed sort order
    return of({
      success: true,
      message: 'Categories reordered successfully'
    }).pipe(delay(300));
  }
}
