import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { Category } from '../models/category.interface';

interface CategoryDetailsModalData {
  category: Category;
}

@Component({
  selector: 'app-category-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <div class="category-details-modal">
      <div mat-dialog-title class="modal-header">
        <div class="title-section">
          <mat-icon [style.color]="data.category.colorCode" class="category-icon">
            {{ data.category.iconName || 'category' }}
          </mat-icon>
          <h2>{{ data.category.name }}</h2>
          <mat-chip class="status-chip" [class.active]="data.category.isActive" [class.inactive]="!data.category.isActive">
            {{ data.category.isActive ? 'Active' : 'Inactive' }}
          </mat-chip>
        </div>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="modal-content">
        <div class="details-grid">
          <!-- Basic Information -->
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>info</mat-icon>
                Basic Information
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Category Code:</span>
                <mat-chip class="code-chip">{{ data.category.code }}</mat-chip>
              </div>
              <div class="detail-row">
                <span class="label">Category Name:</span>
                <span class="value">{{ data.category.name }}</span>
              </div>
              <div class="detail-row" *ngIf="data.category.description">
                <span class="label">Description:</span>
                <span class="value">{{ data.category.description }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Level:</span>
                <mat-chip class="level-chip">Level {{ data.category.level }}</mat-chip>
              </div>
              <div class="detail-row">
                <span class="label">Sort Order:</span>
                <mat-chip class="order-chip">{{ data.category.sortOrder }}</mat-chip>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Hierarchy Information -->
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>account_tree</mat-icon>
                Hierarchy
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Parent Category:</span>
                <span class="value" *ngIf="data.category.parentName">{{ data.category.parentName }}</span>
                <mat-chip class="root-chip" *ngIf="!data.category.parentName">Root Category</mat-chip>
              </div>
              <div class="detail-row">
                <span class="label">Category Path:</span>
                <span class="value category-path">
                  <span *ngIf="data.category.parentName">{{ data.category.parentName }} > </span>
                  <strong>{{ data.category.name }}</strong>
                </span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Products Information -->
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon matBadge="{{ data.category.totalProducts || 0 }}" 
                         matBadgeColor="primary" 
                         matBadgeSize="small"
                         [matBadgeHidden]="!data.category.totalProducts">
                  inventory
                </mat-icon>
                Products
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Total Products:</span>
                <div class="products-count">
                  <mat-chip class="products-chip">{{ data.category.totalProducts || 0 }}</mat-chip>
                  <span class="products-text">
                    {{ (data.category.totalProducts || 0) === 1 ? 'product' : 'products' }} assigned
                  </span>
                </div>
              </div>
              <div class="detail-row" *ngIf="(data.category.totalProducts || 0) > 0">
                <span class="label">Status:</span>
                <mat-chip class="success-chip">Category in use</mat-chip>
              </div>
              <div class="detail-row" *ngIf="(data.category.totalProducts || 0) === 0">
                <span class="label">Status:</span>
                <mat-chip class="warning-chip">No products assigned</mat-chip>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Visual Settings -->
          <mat-card class="info-card" *ngIf="data.category.iconName || data.category.colorCode">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>palette</mat-icon>
                Visual Settings
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row" *ngIf="data.category.iconName">
                <span class="label">Icon:</span>
                <div class="icon-preview">
                  <mat-icon [style.color]="data.category.colorCode">{{ data.category.iconName }}</mat-icon>
                  <span class="icon-name">{{ data.category.iconName }}</span>
                </div>
              </div>
              <div class="detail-row" *ngIf="data.category.colorCode">
                <span class="label">Color:</span>
                <div class="color-preview">
                  <div class="color-swatch" [style.background-color]="data.category.colorCode"></div>
                  <span class="color-code">{{ data.category.colorCode }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="modal-actions">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" (click)="editCategory()">
          <mat-icon>edit</mat-icon>
          Edit Category
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .category-details-modal {
      max-width: 800px;
      width: 100%;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 0 24px;
      margin: 0;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .category-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .title-section h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    .status-chip {
      font-size: 0.75rem;
      min-height: 24px;
    }

    .status-chip.active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-chip.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .close-btn {
      flex-shrink: 0;
    }

    .modal-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .info-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      color: #333;
    }

    .detail-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 120px;
    }

    .value {
      flex: 1;
      text-align: right;
      color: #333;
    }

    .category-path {
      font-family: monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .code-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-family: monospace;
    }

    .level-chip {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .order-chip {
      background-color: #e1f5fe;
      color: #0277bd;
    }

    .root-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .products-count {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .products-chip {
      background-color: #e3f2fd;
      color: #1976d2;
      font-weight: 600;
    }

    .products-text {
      font-size: 0.875rem;
      color: #666;
    }

    .success-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .warning-chip {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .icon-preview, .color-preview {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-name {
      font-family: monospace;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 0 1px #ddd;
    }

    .color-code {
      font-family: monospace;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .modal-actions {
      padding: 16px 24px;
      background: #fafafa;
      border-top: 1px solid #e0e0e0;
    }

    .modal-actions button {
      margin-left: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .details-grid {
        grid-template-columns: 1fr;
      }

      .title-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .value {
        text-align: left;
      }
    }

    /* Animation */
    .info-card {
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
  `]
})
export class CategoryDetailsModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CategoryDetailsModalComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: CategoryDetailsModalData) {}

  editCategory(): void {
    this.dialogRef.close({ action: 'edit', category: this.data.category });
  }
}
