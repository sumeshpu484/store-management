export interface Product {
  id?: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  brand?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product?: Product;
  products?: Product[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  categories?: ProductCategory[];
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface ProductStatsResponse {
  success: boolean;
  message: string;
  stats?: ProductStats;
}
