export interface Category {
  id?: number;
  name: string;
  description?: string;
  code: string;
  parentId?: number;
  parentName?: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  iconName?: string;
  colorCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  totalProducts?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  children?: Category[];
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
