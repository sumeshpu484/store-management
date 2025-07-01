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
import { MatBadgeModule } from '@angular/material/badge';
import { CategoryService } from '../services/category.service';
import { Category, CategoryStats } from '../models/category.interface';
import { CreateCategoryModalComponent } from './create-category-modal.component';
import { EditCategoryModalComponent } from './edit-category-modal.component';
import { CategoryDetailsModalComponent } from './category-details-modal.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal.component';

@Component({
  selector: 'app-categories',
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
    MatBadgeModule
  ],
  template: `
    <div class="categories-container">
      <!-- Header -->
      <div class="header-section">
        <h1 class="page-title">
          <mat-icon>category</mat-icon>
          Category Management
        </h1>
        <p class="page-subtitle">Organize and manage product categories</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-container" *ngIf="stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon total">category</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.totalCategories }}</div>
                <div class="stat-label">Total Categories</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon active">check_circle</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.activeCategories }}</div>
                <div class="stat-label">Active Categories</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon inactive">cancel</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.inactiveCategories }}</div>
                <div class="stat-label">Inactive Categories</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon products">inventory</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ stats.totalProducts }}</div>
                <div class="stat-label">Total Products</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Categories List -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <div class="title-container">
              <mat-icon>list</mat-icon>
              <span>Categories Catalog</span>
            </div>
          </mat-card-title>
          <div class="header-actions">
            <div class="search-container">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control search-input" 
                  placeholder="Search by name or description"
                  (keyup)="applyFilter($event)"
                  aria-label="Search categories">
                <span class="input-group-text">
                  <mat-icon>search</mat-icon>
                </span>
              </div>
            </div>
            <button mat-raised-button color="primary" (click)="openCreateCategoryModal()" class="add-btn">
              <mat-icon>add</mat-icon>
              Add Category
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="categories-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Category Name</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-name">
                    <span class="name">{{ category.name }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let category">
                  <div class="description-cell" [matTooltip]="category.description">
                    {{ category.description && category.description.length > 40 ? (category.description | slice:0:40) + '...' : category.description }}
                  </div>
                </td>
              </ng-container>

              <!-- Products Count Column -->
              <ng-container matColumnDef="products">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Products</th>
                <td mat-cell *matCellDef="let category">
                  <div class="products-count">
                    <mat-icon matBadge="{{ category.totalProducts || 0 }}" 
                             matBadgeColor="primary" 
                             matBadgeSize="small"
                             [matBadgeHidden]="!category.totalProducts">
                      inventory
                    </mat-icon>
                    <span>{{ category.totalProducts || 0 }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let category">
                  <mat-slide-toggle 
                    [checked]="category.isActive"
                    (change)="toggleCategoryStatus(category)"
                    [matTooltip]="category.isActive ? 'Active' : 'Inactive'">
                  </mat-slide-toggle>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let category">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="openEditCategoryModal(category)" 
                            matTooltip="Edit category">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" 
                            (click)="viewCategoryDetails(category)" 
                            matTooltip="View details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" 
                            (click)="deleteCategory(category)" 
                            matTooltip="Delete category"
                            [disabled]="category.totalProducts && category.totalProducts > 0">
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
        
    .categories-container {
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

    .stat-icon.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .stat-icon.products {
      background-color: #fff3e0;
      color: #f57c00;
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
      min-width: 150px;
      border-radius: 4px;
      border: none;
    }

    .table-container {
      overflow-x: auto;
      margin: 16px 0;
    }

    .categories-table {
      width: 100%;
      min-width: 800px;
    }

    .category-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-name .name {
      font-weight: 500;
      color: #333;
    }

    .description-cell {
      max-width: 200px;
      color: #666;
    }

    .products-count {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .products-count mat-icon {
      color: #667eea;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .categories-container {
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
    .table-card, .stat-card {
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
export class CategoriesComponent implements OnInit, AfterViewInit {
  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'description', 'products', 'status', 'actions'];
  dataSource = new MatTableDataSource<Category>([]);
  stats: CategoryStats | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.categories) {
          // Sort categories by name
          const sortedCategories = response.categories.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          this.dataSource.data = sortedCategories;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('❌ Failed to load categories. Please refresh the page.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadStats(): void {
    this.categoryService.getCategoryStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.stats;
        }
      },
      error: (error) => {
        console.error('Error loading category stats:', error);
      }
    });
  }

  openCreateCategoryModal(): void {
    const dialogRef = this.dialog.open(CreateCategoryModalComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
        this.loadStats();
      }
    });
  }

  openEditCategoryModal(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryModalComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true,
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
        this.loadStats();
      }
    });
  }

  viewCategoryDetails(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDetailsModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'edit') {
        this.openEditCategoryModal(result.category);
      }
    });
  }

  toggleCategoryStatus(category: Category): void {
    this.categoryService.toggleCategoryStatus(category.id!).subscribe({
      next: (response) => {
        if (response.success) {
          const statusText = category.isActive ? 'deactivated' : 'activated';
          this.snackBar.open(`✅ Category "${category.name}" ${statusText} successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCategories();
          this.loadStats();
        }
      },
      error: (error) => {
        console.error('Error updating category status:', error);
        this.snackBar.open(`❌ Failed to update status for "${category.name}". Please try again.`, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
        confirmText: 'Delete Category',
        cancelText: 'Cancel',
        type: 'delete',
        icon: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(category.id!).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open(`✅ Category "${category.name}" deleted successfully!`, 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loadCategories();
              this.loadStats();
            } else {
              this.snackBar.open(`❌ Failed to delete category: ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.snackBar.open(`❌ Failed to delete category "${category.name}". Please try again.`, 'Close', {
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
