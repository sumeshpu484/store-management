import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory } from '../models/product.interface';

@Component({
  selector: 'app-view-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>visibility</mat-icon>
        Product Details
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <!-- Basic Information -->
      <mat-card class="info-section">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Basic Information
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <label>Product Name:</label>
              <span class="value">{{ product.name }}</span>
            </div>
            <div class="info-item">
              <label>Brand:</label>
              <span class="value">{{ product.brand || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Category:</label>
              <span class="value">{{ getCategoryName() }}</span>
            </div>
            <div class="info-item">
              <label>Unit:</label>
              <span class="value">{{ product.unit | titlecase }}</span>
            </div>
            <div class="info-item full-width">
              <label>Description:</label>
              <span class="value">{{ product.description || 'No description available' }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Inventory Information -->
      <mat-card class="info-section">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>inventory</mat-icon>
            Inventory Details
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <label>Current Stock:</label>
              <span class="value stock-value" [ngClass]="getStockClass()">
                {{ product.stockQuantity }} {{ product.unit }}
                <mat-icon *ngIf="isLowStock()" class="warning-icon">warning</mat-icon>
              </span>
            </div>
            <div class="info-item">
              <label>Min Stock Level:</label>
              <span class="value">{{ product.minStockLevel }} {{ product.unit }}</span>
            </div>
            <div class="info-item">
              <label>Max Stock Level:</label>
              <span class="value">{{ product.maxStockLevel }} {{ product.unit }}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <mat-chip [ngClass]="product.isActive ? 'active-chip' : 'inactive-chip'">
                <mat-icon>{{ product.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                {{ product.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="close-btn">Close</button>
      <button mat-raised-button color="primary" (click)="editProduct()" class="edit-btn">
        <mat-icon>edit</mat-icon>
        Edit Product
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      margin-bottom: 16px;
    }

    .modal-header h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #333;
      line-height: 1;
    }

    .modal-header h2 mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .modal-header button {
      width: 40px;
      height: 40px;
      line-height: 1;
    }

    .modal-header button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .modal-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0 24px;
      min-width: 600px;
    }

    .info-section {
      margin-bottom: 16px;
    }

    .info-section mat-card-header {
      padding-bottom: 16px;
    }

    .info-section mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
    }

    .info-section mat-card-title mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #667eea;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .info-item .value {
      color: #333;
      font-size: 1rem;
    }

    .stock-value {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .stock-value.low-stock {
      color: #f57c00;
    }

    .stock-value.out-of-stock {
      color: #d32f2f;
    }

    .stock-value.normal-stock {
      color: #388e3c;
    }

    .warning-icon {
      color: #f57c00;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .active-chip {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      color: white;
    }

    .inactive-chip {
      background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
      color: white;
    }

    .active-chip mat-icon,
    .inactive-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .modal-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .close-btn {
      color: #666;
    }

    .edit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-content {
        min-width: auto;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-item.full-width {
        grid-column: 1;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .close-btn,
      .edit-btn {
        width: 100%;
      }
    }
  `]
})
export class ViewProductModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ViewProductModalComponent>);
  private readonly productService = inject(ProductService);
  
  product: Product;
  categoryName: string = 'N/A';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product, categoryName?: string }) {
    this.product = data.product;
    this.categoryName = data.categoryName || 'N/A';
  }

  ngOnInit(): void {
    // If category name wasn't provided, try to fetch it
    if (!this.data.categoryName && this.product.categoryId) {
      this.loadCategoryName();
    }
  }

  private loadCategoryName(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.categories) {
          const category = response.categories.find(c => c.id === this.product.categoryId);
          this.categoryName = category ? category.name : 'N/A';
        }
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.categoryName = 'N/A';
      }
    });
  }

  getCategoryName(): string {
    return this.categoryName;
  }

  isLowStock(): boolean {
    return this.product.stockQuantity <= this.product.minStockLevel;
  }

  getStockClass(): string {
    if (this.product.stockQuantity === 0) {
      return 'out-of-stock';
    } else if (this.isLowStock()) {
      return 'low-stock';
    }
    return 'normal-stock';
  }

  editProduct(): void {
    this.dialogRef.close({ action: 'edit', product: this.product });
  }
}
