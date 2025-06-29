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
      code: 'ELEC',
      level: 1,
      sortOrder: 1,
      isActive: true,
      iconName: 'devices',
      colorCode: '#2196F3',
      metaTitle: 'Electronics - Latest Gadgets & Devices',
      metaDescription: 'Shop the latest electronics including smartphones, laptops, tablets and more',
      slug: 'electronics',
      totalProducts: 45,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 2,
      name: 'Smartphones',
      description: 'Mobile phones and smartphone accessories',
      code: 'SMART',
      parentId: 1,
      parentName: 'Electronics',
      level: 2,
      sortOrder: 1,
      isActive: true,
      iconName: 'smartphone',
      colorCode: '#4CAF50',
      metaTitle: 'Smartphones - Latest Mobile Phones',
      metaDescription: 'Discover the latest smartphones from top brands',
      slug: 'smartphones',
      totalProducts: 25,
      createdAt: '2024-01-02T11:00:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 3,
      name: 'Laptops',
      description: 'Portable computers and laptop accessories',
      code: 'LAPTOP',
      parentId: 1,
      parentName: 'Electronics',
      level: 2,
      sortOrder: 2,
      isActive: true,
      iconName: 'laptop',
      colorCode: '#FF9800',
      metaTitle: 'Laptops - Portable Computers',
      metaDescription: 'Browse our collection of laptops for work and gaming',
      slug: 'laptops',
      totalProducts: 20,
      createdAt: '2024-01-03T12:00:00Z',
      updatedAt: '2024-01-17T16:45:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 4,
      name: 'Food & Beverages',
      description: 'Food items, drinks, and consumables',
      code: 'FOOD',
      level: 1,
      sortOrder: 2,
      isActive: true,
      iconName: 'restaurant',
      colorCode: '#E91E63',
      metaTitle: 'Food & Beverages - Fresh & Quality Products',
      metaDescription: 'Quality food and beverages for your daily needs',
      slug: 'food-beverages',
      totalProducts: 120,
      createdAt: '2024-01-04T13:00:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 5,
      name: 'Beverages',
      description: 'Soft drinks, juices, and beverages',
      code: 'BEV',
      parentId: 4,
      parentName: 'Food & Beverages',
      level: 2,
      sortOrder: 1,
      isActive: true,
      iconName: 'local_drink',
      colorCode: '#9C27B0',
      metaTitle: 'Beverages - Drinks & Juices',
      metaDescription: 'Refreshing beverages and healthy drinks',
      slug: 'beverages',
      totalProducts: 35,
      createdAt: '2024-01-05T14:00:00Z',
      updatedAt: '2024-01-19T13:30:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 6,
      name: 'Snacks',
      description: 'Chips, crackers, and snack foods',
      code: 'SNACK',
      parentId: 4,
      parentName: 'Food & Beverages',
      level: 2,
      sortOrder: 2,
      isActive: true,
      iconName: 'fastfood',
      colorCode: '#FF5722',
      metaTitle: 'Snacks - Tasty Treats & Chips',
      metaDescription: 'Delicious snacks and treats for any time',
      slug: 'snacks',
      totalProducts: 40,
      createdAt: '2024-01-06T15:00:00Z',
      updatedAt: '2024-01-20T10:15:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 7,
      name: 'Clothing',
      description: 'Apparel, fashion, and accessories',
      code: 'CLOTH',
      level: 1,
      sortOrder: 3,
      isActive: true,
      iconName: 'checkroom',
      colorCode: '#795548',
      metaTitle: 'Clothing - Fashion & Apparel',
      metaDescription: 'Stylish clothing and fashion accessories',
      slug: 'clothing',
      totalProducts: 80,
      createdAt: '2024-01-07T16:00:00Z',
      updatedAt: '2024-01-21T12:45:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 8,
      name: 'Men\'s Clothing',
      description: 'Men\'s apparel and accessories',
      code: 'MENS',
      parentId: 7,
      parentName: 'Clothing',
      level: 2,
      sortOrder: 1,
      isActive: true,
      iconName: 'man',
      colorCode: '#607D8B',
      metaTitle: 'Men\'s Clothing - Fashion for Men',
      metaDescription: 'Trendy men\'s clothing and accessories',
      slug: 'mens-clothing',
      totalProducts: 45,
      createdAt: '2024-01-08T17:00:00Z',
      updatedAt: '2024-01-22T14:20:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 9,
      name: 'Home & Garden',
      description: 'Home improvement and garden supplies',
      code: 'HOME',
      level: 1,
      sortOrder: 4,
      isActive: false,
      iconName: 'home',
      colorCode: '#8BC34A',
      metaTitle: 'Home & Garden - Improve Your Space',
      metaDescription: 'Everything for your home and garden needs',
      slug: 'home-garden',
      totalProducts: 15,
      createdAt: '2024-01-09T18:00:00Z',
      updatedAt: '2024-01-23T15:30:00Z',
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
    const parentCategories = this.categories.filter(c => c.level === 1 && c.isActive);
    return of({
      success: true,
      message: 'Parent categories retrieved successfully',
      categories: parentCategories
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
    if (!category.name || !category.code) {
      return of({
        success: false,
        message: 'Name and Code are required fields'
      }).pipe(delay(200));
    }

    // Check if code already exists
    if (this.categories.some(c => c.code.toLowerCase() === category.code.toLowerCase())) {
      return of({
        success: false,
        message: 'Category code already exists'
      }).pipe(delay(200));
    }

    // Generate slug from name
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug already exists
    if (this.categories.some(c => c.slug === slug)) {
      return of({
        success: false,
        message: 'Category name generates a slug that already exists'
      }).pipe(delay(200));
    }

    // Set parent category name if parentId is provided
    let parentName = undefined;
    let level = 1;
    if (category.parentId) {
      const parent = this.categories.find(c => c.id === category.parentId);
      if (parent) {
        parentName = parent.name;
        level = parent.level + 1;
      }
    }

    const newCategory: Category = {
      ...category,
      id: this.nextCategoryId++,
      parentName,
      level,
      slug,
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

    // Check if code already exists (excluding current category)
    if (this.categories.some(c => c.code.toLowerCase() === category.code.toLowerCase() && c.id !== id)) {
      return of({
        success: false,
        message: 'Category code already exists'
      }).pipe(delay(200));
    }

    // Generate slug from name
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if slug already exists (excluding current category)
    if (this.categories.some(c => c.slug === slug && c.id !== id)) {
      return of({
        success: false,
        message: 'Category name generates a slug that already exists'
      }).pipe(delay(200));
    }

    // Set parent category name if parentId is provided
    let parentName = undefined;
    let level = 1;
    if (category.parentId) {
      const parent = this.categories.find(c => c.id === category.parentId);
      if (parent) {
        parentName = parent.name;
        level = parent.level + 1;
      }
    }

    const updatedCategory: Category = {
      ...this.categories[index],
      ...category,
      id: id,
      parentName,
      level,
      slug,
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

    // Check if category has child categories
    const hasChildren = this.categories.some(c => c.parentId === id);
    if (hasChildren) {
      return of({
        success: false,
        message: 'Cannot delete category that has subcategories. Please delete subcategories first.'
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
    const baseCode = name.toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);
    
    let code = baseCode;
    let counter = 1;
    
    while (this.categories.some(c => c.code === code)) {
      code = baseCode + counter.toString().padStart(2, '0');
      counter++;
    }
    
    return code;
  }

  reorderCategories(categoryIds: number[]): Observable<CategoryResponse> {
    categoryIds.forEach((id, index) => {
      const category = this.categories.find(c => c.id === id);
      if (category) {
        category.sortOrder = index + 1;
        category.updatedAt = new Date().toISOString();
        category.updatedBy = 'current-user';
      }
    });

    return of({
      success: true,
      message: 'Categories reordered successfully'
    }).pipe(delay(300));
  }
}
