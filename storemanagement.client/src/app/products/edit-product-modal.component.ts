import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory } from '../models/product.interface';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>edit</mat-icon>
        Edit Product
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <form [formGroup]="productForm" class="product-form">
        <!-- Basic Information -->
        <div class="form-section">
          <h3>Basic Information</h3>
          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Product Name *</mat-label>
              <input matInput formControlName="name" placeholder="Enter product name">
              <mat-error *ngIf="productForm.get('name')?.hasError('required')">
                Product name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Brand</mat-label>
              <input matInput formControlName="brand" placeholder="Enter brand name">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Enter product description"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Category *</mat-label>
              <mat-select formControlName="categoryId">
                <mat-option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">
                Category is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Unit *</mat-label>
              <mat-select formControlName="unit">
                <mat-option value="piece">Piece</mat-option>
                <mat-option value="kg">Kilogram</mat-option>
                <mat-option value="gram">Gram</mat-option>
                <mat-option value="liter">Liter</mat-option>
                <mat-option value="ml">Milliliter</mat-option>
                <mat-option value="meter">Meter</mat-option>
                <mat-option value="cm">Centimeter</mat-option>
                <mat-option value="box">Box</mat-option>
                <mat-option value="pack">Pack</mat-option>
              </mat-select>
              <mat-error *ngIf="productForm.get('unit')?.hasError('required')">
                Unit is required
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Inventory -->
        <div class="form-section">
          <h3>Inventory Management</h3>
          <div class="form-row">
            <mat-form-field class="third-width">
              <mat-label>Current Stock *</mat-label>
              <input matInput type="number" formControlName="stockQuantity" placeholder="0" min="0">
              <mat-error *ngIf="productForm.get('stockQuantity')?.hasError('required')">
                Stock quantity is required
              </mat-error>
              <mat-error *ngIf="productForm.get('stockQuantity')?.hasError('min')">
                Stock quantity cannot be negative
              </mat-error>
            </mat-form-field>

            <mat-form-field class="third-width">
              <mat-label>Min Stock Level *</mat-label>
              <input matInput type="number" formControlName="minStockLevel" placeholder="0" min="0">
              <mat-error *ngIf="productForm.get('minStockLevel')?.hasError('required')">
                Min stock level is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="third-width">
              <mat-label>Max Stock Level *</mat-label>
              <input matInput type="number" formControlName="maxStockLevel" placeholder="0" min="1">
              <mat-error *ngIf="productForm.get('maxStockLevel')?.hasError('required')">
                Max stock level is required
              </mat-error>
              <mat-error *ngIf="productForm.get('maxStockLevel')?.hasError('min')">
                Max stock level must be at least 1
              </mat-error>
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="cancel-btn">Cancel</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSubmit()" 
              [disabled]="productForm.invalid || isSubmitting"
              class="submit-btn">
        <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
        <mat-icon *ngIf="!isSubmitting">save</mat-icon>
        {{ isSubmitting ? 'Updating...' : 'Update Product' }}
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
    }

    .modal-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0 24px;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      background: #fafafa;
    }

    .form-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .third-width {
      width: calc(33.333% - 11px);
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .modal-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .cancel-btn {
      color: #666;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .submit-btn mat-spinner {
      margin-right: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .half-width,
      .third-width {
        width: 100%;
      }
    }
  `]
})
export class EditProductModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly dialogRef = inject(MatDialogRef<EditProductModalComponent>);
  private readonly snackBar = inject(MatSnackBar);

  productForm!: FormGroup;
  categories: ProductCategory[] = [];
  isSubmitting = false;
  product: Product;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product }) {
    this.product = data.product;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.populateForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      brand: [''],
      categoryId: [null, [Validators.required]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      maxStockLevel: [0, [Validators.required, Validators.min(1)]],
      unit: ['piece', [Validators.required]]
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.categories) {
          this.categories = response.categories.filter(c => c.isActive);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private populateForm(): void {
    this.productForm.patchValue({
      name: this.product.name,
      description: this.product.description,
      brand: this.product.brand,
      categoryId: this.product.categoryId,
      stockQuantity: this.product.stockQuantity,
      minStockLevel: this.product.minStockLevel,
      maxStockLevel: this.product.maxStockLevel,
      unit: this.product.unit
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.productForm.value;

      const product: Product = {
        ...formValue,
        id: this.product.id
      };

      this.productService.updateProduct(this.product.id!, product).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open(`✅ Product "${product.name}" updated successfully!`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open(`❌ Failed to update product: ${response.message}`, 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating product:', error);
          this.snackBar.open('❌ Failed to update product. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
