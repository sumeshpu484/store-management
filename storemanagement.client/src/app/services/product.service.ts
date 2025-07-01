import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductResponse, ProductCategory, CategoryResponse, ProductStats, ProductStatsResponse } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 25,
      minStockLevel: 5,
      maxStockLevel: 100,
      unit: 'piece',
      brand: 'TechBrand',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 2,
      name: 'Organic Coffee Beans',
      description: 'Premium organic coffee beans from Ethiopia',
      categoryId: 2,
      categoryName: 'Food & Beverages',
      stockQuantity: 50,
      minStockLevel: 10,
      maxStockLevel: 200,
      unit: 'kg',
      brand: 'BrewMaster',
      isActive: true,
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 3,
      name: 'Gaming Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 15,
      minStockLevel: 3,
      maxStockLevel: 50,
      unit: 'piece',
      brand: 'GameTech',
      isActive: true,
      createdAt: '2024-01-12T16:00:00Z',
      updatedAt: '2024-01-22T10:30:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ];

  private categories: ProductCategory[] = [
    { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', isActive: true },
    { id: 2, name: 'Food & Beverages', description: 'Food items and beverages', isActive: true },
    { id: 3, name: 'Clothing', description: 'Clothing and apparel', isActive: true },
    { id: 4, name: 'Home & Garden', description: 'Home and garden items', isActive: true },
    { id: 5, name: 'Sports & Outdoors', description: 'Sports and outdoor equipment', isActive: true }
  ];

  private nextProductId = 4;

  getProducts(): Observable<ProductResponse> {
    return of({
      success: true,
      message: 'Products retrieved successfully',
      products: [...this.products]
    }).pipe(delay(300));
  }

  getProductById(id: number): Observable<ProductResponse> {
    const product = this.products.find(p => p.id === id);
    return of({
      success: !!product,
      message: product ? 'Product found' : 'Product not found',
      product: product
    }).pipe(delay(200));
  }

  createProduct(product: Product): Observable<ProductResponse> {
    // Validate required fields
    if (!product.name || !product.categoryId) {
      return of({
        success: false,
        message: 'Name and Category are required fields'
      }).pipe(delay(200));
    }

    // Add category name
    const category = this.categories.find(c => c.id === product.categoryId);
    
    const newProduct: Product = {
      ...product,
      id: this.nextProductId++,
      categoryName: category?.name,
      isActive: product.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      updatedBy: 'current-user'
    };

    this.products.push(newProduct);

    return of({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    }).pipe(delay(500));
  }

  updateProduct(id: number, product: Product): Observable<ProductResponse> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Product not found'
      }).pipe(delay(200));
    }

    // Add category name
    const category = this.categories.find(c => c.id === product.categoryId);

    const updatedProduct: Product = {
      ...this.products[index],
      ...product,
      id: id,
      categoryName: category?.name,
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user'
    };

    this.products[index] = updatedProduct;

    return of({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    }).pipe(delay(500));
  }

  deleteProduct(id: number): Observable<ProductResponse> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Product not found'
      }).pipe(delay(200));
    }

    this.products.splice(index, 1);

    return of({
      success: true,
      message: 'Product deleted successfully'
    }).pipe(delay(500));
  }

  toggleProductStatus(id: number): Observable<ProductResponse> {
    const product = this.products.find(p => p.id === id);
    
    if (!product) {
      return of({
        success: false,
        message: 'Product not found'
      }).pipe(delay(200));
    }

    product.isActive = !product.isActive;
    product.updatedAt = new Date().toISOString();
    product.updatedBy = 'current-user';

    return of({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product: product
    }).pipe(delay(300));
  }

  getCategories(): Observable<CategoryResponse> {
    return of({
      success: true,
      message: 'Categories retrieved successfully',
      categories: [...this.categories]
    }).pipe(delay(200));
  }

  getProductStats(): Observable<ProductStatsResponse> {
    const activeProducts = this.products.filter(p => p.isActive).length;
    const inactiveProducts = this.products.filter(p => !p.isActive).length;
    const lowStockProducts = this.products.filter(p => p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0).length;
    const outOfStockProducts = this.products.filter(p => p.stockQuantity === 0).length;

    const stats: ProductStats = {
      totalProducts: this.products.length,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      outOfStockProducts
    };

    return of({
      success: true,
      message: 'Product stats retrieved successfully',
      stats
    }).pipe(delay(200));
  }
}
