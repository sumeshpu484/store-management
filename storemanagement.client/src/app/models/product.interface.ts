export interface Product {
  id?: number;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  brand?: string;
  supplier?: string;
  supplierId?: number;
  isActive: boolean;
  isPerishable: boolean;
  expiryDate?: string;
  manufacturedDate?: string;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  tags?: string[];
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
  totalValue: number;
  totalCostValue: number;
  perishableProducts: number;
}

export interface ProductStatsResponse {
  success: boolean;
  message: string;
  stats?: ProductStats;
}
