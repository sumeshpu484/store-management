import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory, ProductStats } from '../models/product.interface';
import { CreateProductModalComponent } from './create-product-modal.component';
import { EditProductModalComponent } from './edit-product-modal.component';
import { ViewProductModalComponent } from './view-product-modal.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule
  ],
  template: `
    <div class="products-container">
      <!-- Header -->
      <div class="header-section">
        <h1 class="page-title">
          <mat-icon>shopping_cart</mat-icon>
          Product Management
        </h1>
        <p class="page-subtitle">Manage your product catalog, inventory, and pricing</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-container" *ngIf="stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon total">inventory</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.totalProducts }}</div>
                <div class="stat-label">Total Products</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon active">check_circle</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.activeProducts }}</div>
                <div class="stat-label">Active Products</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon warning">warning</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.lowStockProducts }}</div>
                <div class="stat-label">Low Stock</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon danger">remove_circle</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.outOfStockProducts }}</div>
                <div class="stat-label">Out of Stock</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Products List -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <div class="title-container">
              <mat-icon>inventory</mat-icon>
              <span>Products Catalog</span>
            </div>
          </mat-card-title>
          <div class="header-actions">
            <div class="search-container">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control search-input" 
                  placeholder="Search by name, SKU, or barcode"
                  (keyup)="applyFilter($event)"
                  aria-label="Search products">
                <span class="input-group-text">
                  <mat-icon>search</mat-icon>
                </span>
              </div>
            </div>
            <button mat-raised-button color="primary" (click)="openCreateProductModal()" class="add-btn">
              <mat-icon>add</mat-icon>
              Add Product
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="products-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Product Name</th>
                <td mat-cell *matCellDef="let product">
                  <div class="product-name">
                    <div class="name">{{ product.name }}</div>
                    <div class="brand" *ngIf="product.brand">{{ product.brand }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Category Column -->
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip class="category-chip">
                    <mat-icon matChipAvatar>category</mat-icon>
                    {{ product.categoryName }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Stock Column -->
              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
                <td mat-cell *matCellDef="let product">
                  <div class="stock-info">
                    <div class="stock-quantity" 
                         [class.low-stock]="product.stockQuantity <= product.minStockLevel"
                         [class.out-of-stock]="product.stockQuantity === 0">
                      {{ product.stockQuantity }} {{ product.unit }}
                    </div>
                    <div class="stock-levels">
                      Min: {{ product.minStockLevel }} | Max: {{ product.maxStockLevel }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let product">
                  <mat-slide-toggle 
                    [checked]="product.isActive"
                    (change)="toggleProductStatus(product)"
                    [matTooltip]="product.isActive ? 'Active' : 'Inactive'">
                  </mat-slide-toggle>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let product">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="openEditProductModal(product)" 
                            matTooltip="Edit product">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" 
                            (click)="viewProductDetails(product)" 
                            matTooltip="View details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" 
                            (click)="deleteProduct(product)" 
                            matTooltip="Delete product">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator [pageSizeOptions]="[5, 10, 20, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    /* Search Container Styles */
    .search-container {
      width: 300px;
    }

    .input-group {
      height: 32px;
    }

    .search-input {
      height: 32px !important;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      padding: 0 12px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }

    .input-group-text {
      height: 32px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-left: none;
      border-radius: 0 4px 4px 0;
      display: flex;
      align-items: center;
      padding: 0 12px;
      color: #6c757d;
    }

    .input-group-text mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .title-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
        
    .products-container {
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
    }

    .header-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 2.5rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .page-title mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #667eea;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
    }

    /* Stats Container */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.total {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .stat-icon.active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .stat-icon.warning {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .stat-icon.danger {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .stat-icon.value {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .stat-icon.perishable {
      background-color: #e0f2f1;
      color: #00695c;
    }

    .stat-details {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      margin-top: 4px;
    }

    /* Table Styles */
    .table-card {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-left: auto;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 140px;
      border-radius: 4px;
      border: none;
    }

    .table-container {
      overflow-x: auto;
      margin: 16px 0;
    }

    .products-table {
      width: 100%;
      min-width: 1200px;
    }

    .product-name .name {
      font-weight: 500;
      color: #333;
    }

    .product-name .brand {
      font-size: 0.85em;
      color: #666;
      font-style: italic;
    }

    .category-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .stock-info .stock-quantity {
      font-weight: 600;
      color: #333;
    }

    .stock-info .stock-quantity.low-stock {
      color: #ff9800;
    }

    .stock-info .stock-quantity.out-of-stock {
      color: #f44336;
    }

    .stock-info .stock-levels {
      font-size: 0.8em;
      color: #666;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      min-height: 32px;
    }

    .action-buttons button[color="primary"] mat-icon {
      color: #1976d2 !important;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .action-buttons button[color="accent"] mat-icon {
      color: #ff4081 !important;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .action-buttons button[color="warn"] mat-icon {
      color: #f44336 !important;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .products-container {
        padding: 16px;
      }

      .page-title {
        font-size: 2rem;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        width: 100%;
      }

      .stats-container {
        grid-template-columns: 1fr;
      }
    }

    /* Animation */
    .table-card {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Snackbar Styles */
    ::ng-deep .success-snackbar {
      background-color: #4caf50 !important;
      color: white !important;
    }

    ::ng-deep .error-snackbar {
      background-color: #f44336 !important;
      color: white !important;
    }

    ::ng-deep .info-snackbar {
      background-color: #2196f3 !important;
      color: white !important;
    }

    ::ng-deep .warning-snackbar {
      background-color: #ff9800 !important;
      color: white !important;
    }
  `]
})
export class ProductsComponent implements OnInit, AfterViewInit {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'category', 'stock', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  stats: ProductStats | null = null;

  ngOnInit(): void {
    this.loadProducts();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success && response.products) {
          this.dataSource.data = response.products;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('❌ Failed to load products. Please refresh the page.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadStats(): void {
    this.productService.getProductStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.stats || null;
        }
      },
      error: (error) => {
        console.error('Error loading product stats:', error);
      }
    });
  }

  openCreateProductModal(): void {
    const dialogRef = this.dialog.open(CreateProductModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.loadStats();
      }
    });
  }

  openEditProductModal(product: Product): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.loadStats();
      }
    });
  }

  viewProductDetails(product: Product): void {
    const dialogRef = this.dialog.open(ViewProductModalComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { 
        product: product
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        // If user clicked edit from the view modal, open edit modal
        this.openEditProductModal(result.product);
      }
    });
  }

  toggleProductStatus(product: Product): void {
    this.productService.toggleProductStatus(product.id!).subscribe({
      next: (response) => {
        if (response.success) {
          const statusText = product.isActive ? 'deactivated' : 'activated';
          this.snackBar.open(`✅ Product "${product.name}" ${statusText} successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadProducts();
          this.loadStats();
        }
      },
      error: (error) => {
        console.error('Error updating product status:', error);
        this.snackBar.open(`❌ Failed to update status for "${product.name}". Please try again.`, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        confirmText: 'Delete Product',
        cancelText: 'Cancel',
        type: 'delete',
        icon: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id!).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open(`✅ Product "${product.name}" deleted successfully!`, 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loadProducts();
              this.loadStats();
            }
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.snackBar.open(`❌ Failed to delete product "${product.name}". Please try again.`, 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
