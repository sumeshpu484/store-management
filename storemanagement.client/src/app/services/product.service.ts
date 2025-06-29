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
      sku: 'WBH-001',
      barcode: '1234567890123',
      categoryId: 1,
      categoryName: 'Electronics',
      price: 99.99,
      cost: 65.00,
      stockQuantity: 25,
      minStockLevel: 5,
      maxStockLevel: 100,
      unit: 'piece',
      brand: 'TechBrand',
      supplier: 'Electronics Supplier Inc.',
      supplierId: 1,
      isActive: true,
      isPerishable: false,
      weight: 0.3,
      dimensions: '20x15x8 cm',
      imageUrl: 'https://via.placeholder.com/150/0066cc/FFFFFF?text=Headphones',
      tags: ['wireless', 'bluetooth', 'audio'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 2,
      name: 'Organic Coffee Beans',
      description: 'Premium organic coffee beans from Ethiopia',
      sku: 'OCB-002',
      barcode: '2345678901234',
      categoryId: 2,
      categoryName: 'Food & Beverages',
      price: 24.99,
      cost: 15.00,
      stockQuantity: 50,
      minStockLevel: 10,
      maxStockLevel: 200,
      unit: 'kg',
      brand: 'BrewMaster',
      supplier: 'Coffee Imports Ltd.',
      supplierId: 2,
      isActive: true,
      isPerishable: true,
      expiryDate: '2024-12-31',
      manufacturedDate: '2024-01-01',
      weight: 1.0,
      dimensions: '25x15x10 cm',
      imageUrl: 'https://via.placeholder.com/150/8B4513/FFFFFF?text=Coffee',
      tags: ['organic', 'coffee', 'premium'],
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      id: 3,
      name: 'Gaming Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches',
      sku: 'GMK-003',
      barcode: '3456789012345',
      categoryId: 1,
      categoryName: 'Electronics',
      price: 149.99,
      cost: 95.00,
      stockQuantity: 15,
      minStockLevel: 3,
      maxStockLevel: 50,
      unit: 'piece',
      brand: 'GameTech',
      supplier: 'Gaming Gear Co.',
      supplierId: 3,
      isActive: true,
      isPerishable: false,
      weight: 1.2,
      dimensions: '45x15x4 cm',
      imageUrl: 'https://via.placeholder.com/150/FF6600/FFFFFF?text=Keyboard',
      tags: ['gaming', 'mechanical', 'rgb'],
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
    if (!product.name || !product.sku || !product.categoryId) {
      return of({
        success: false,
        message: 'Name, SKU, and Category are required fields'
      }).pipe(delay(200));
    }

    // Check if SKU already exists
    if (this.products.some(p => p.sku === product.sku)) {
      return of({
        success: false,
        message: 'SKU already exists'
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

    // Check if SKU already exists (excluding current product)
    if (this.products.some(p => p.sku === product.sku && p.id !== id)) {
      return of({
        success: false,
        message: 'SKU already exists'
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

  generateSKU(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    const prefix = category ? category.name.substring(0, 3).toUpperCase() : 'GEN';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  generateBarcode(): string {
    return (Math.floor(Math.random() * 9000000000000) + 1000000000000).toString();
  }

  getProductStats(): Observable<ProductStatsResponse> {
    const activeProducts = this.products.filter(p => p.isActive).length;
    const inactiveProducts = this.products.filter(p => !p.isActive).length;
    const lowStockProducts = this.products.filter(p => p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0).length;
    const outOfStockProducts = this.products.filter(p => p.stockQuantity === 0).length;
    const perishableProducts = this.products.filter(p => p.isPerishable).length;
    
    const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
    const totalCostValue = this.products.reduce((sum, p) => sum + (p.cost * p.stockQuantity), 0);

    const stats: ProductStats = {
      totalProducts: this.products.length,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      totalCostValue,
      perishableProducts
    };

    return of({
      success: true,
      message: 'Product stats retrieved successfully',
      stats
    }).pipe(delay(200));
  }
}
