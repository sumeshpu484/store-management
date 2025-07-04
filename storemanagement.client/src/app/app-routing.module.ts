import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: 'home', 
    loadComponent: () => import('./home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'test', 
    loadComponent: () => import('./test.component').then(m => m.TestComponent)
  },
  { 
    path: 'store-management', 
    loadComponent: () => import('./store-management/store-management.component').then(m => m.StoreManagementComponent)
    // canActivate: [AuthGuard] // Commented out for development
  },
  { 
    path: 'products', 
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent)
  },
  { 
    path: 'categories', 
    loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
