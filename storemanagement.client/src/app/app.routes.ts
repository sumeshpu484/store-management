import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'home', 
        loadComponent: () => import('./home.component').then(m => m.HomeComponent)
      },
      { 
        path: 'test', 
        loadComponent: () => import('./test.component').then(m => m.TestComponent)
      },
      { 
        path: 'stores', 
        loadComponent: () => import('./store-management/store-management.component').then(m => m.StoreManagementComponent)
      },
      { 
        path: 'products', 
        loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent)
      },
      { 
        path: 'categories', 
        loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent)
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
