export interface Category {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  totalProducts?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category?: Category;
  categories?: Category[];
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalProducts: number;
}
