import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../services/product.service';
import { Product, ProductCategory } from '../models/product.interface';

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>add_shopping_cart</mat-icon>
        Create New Product
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
              <mat-select formControlName="categoryId" (selectionChange)="onCategoryChange()">
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

        <!-- Product Codes -->
        <div class="form-section">
          <h3>Product Codes</h3>
          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>SKU *</mat-label>
              <input matInput formControlName="sku" placeholder="Enter SKU">
              <button mat-icon-button matSuffix type="button" (click)="generateSKU()" matTooltip="Generate SKU">
                <mat-icon>refresh</mat-icon>
              </button>
              <mat-error *ngIf="productForm.get('sku')?.hasError('required')">
                SKU is required
              </mat-error>
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Barcode</mat-label>
              <input matInput formControlName="barcode" placeholder="Enter barcode">
              <button mat-icon-button matSuffix type="button" (click)="generateBarcode()" matTooltip="Generate Barcode">
                <mat-icon>refresh</mat-icon>
              </button>
            </mat-form-field>
          </div>
        </div>

        <!-- Pricing -->
        <div class="form-section">
          <h3>Pricing</h3>
          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Cost Price *</mat-label>
              <input matInput type="number" formControlName="cost" placeholder="0.00" step="0.01">
              <span matTextPrefix>₹&nbsp;</span>
              <mat-error *ngIf="productForm.get('cost')?.hasError('required')">
                Cost price is required
              </mat-error>
              <mat-error *ngIf="productForm.get('cost')?.hasError('min')">
                Cost price must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Selling Price *</mat-label>
              <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01">
              <span matTextPrefix>₹&nbsp;</span>
              <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                Selling price is required
              </mat-error>
              <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                Selling price must be greater than 0
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

        <!-- Physical Properties -->
        <div class="form-section">
          <h3>Physical Properties</h3>
          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Weight (kg)</mat-label>
              <input matInput type="number" formControlName="weight" placeholder="0.00" step="0.01" min="0">
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Dimensions</mat-label>
              <input matInput formControlName="dimensions" placeholder="e.g. 20x15x8 cm">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field class="full-width">
              <mat-label>Image URL</mat-label>
              <input matInput formControlName="imageUrl" placeholder="Enter image URL">
            </mat-form-field>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="form-section">
          <h3>Additional Information</h3>
          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Supplier</mat-label>
              <input matInput formControlName="supplier" placeholder="Enter supplier name">
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Tags (comma separated)</mat-label>
              <input matInput formControlName="tagsInput" placeholder="e.g. electronics, wireless, premium">
            </mat-form-field>
          </div>

          <div class="form-row">
            <div class="checkbox-group">
              <mat-checkbox formControlName="isActive">Active Product</mat-checkbox>
              <mat-checkbox formControlName="isPerishable">Perishable Item</mat-checkbox>
            </div>
          </div>

          <div class="form-row" *ngIf="productForm.get('isPerishable')?.value">
            <mat-form-field class="half-width">
              <mat-label>Manufactured Date</mat-label>
              <input matInput [matDatepicker]="mfgPicker" formControlName="manufacturedDate">
              <mat-datepicker-toggle matIconSuffix [for]="mfgPicker"></mat-datepicker-toggle>
              <mat-datepicker #mfgPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Expiry Date</mat-label>
              <input matInput [matDatepicker]="expPicker" formControlName="expiryDate">
              <mat-datepicker-toggle matIconSuffix [for]="expPicker"></mat-datepicker-toggle>
              <mat-datepicker #expPicker></mat-datepicker>
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
        <mat-icon *ngIf="!isSubmitting">add</mat-icon>
        {{ isSubmitting ? 'Creating...' : 'Create Product' }}
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
export class CreateProductModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly dialogRef = inject(MatDialogRef<CreateProductModalComponent>);

  productForm!: FormGroup;
  categories: ProductCategory[] = [];
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      brand: [''],
      sku: ['', [Validators.required]],
      barcode: [''],
      categoryId: [null, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      cost: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      maxStockLevel: [0, [Validators.required, Validators.min(1)]],
      unit: ['piece', [Validators.required]],
      weight: [0, [Validators.min(0)]],
      dimensions: [''],
      imageUrl: [''],
      supplier: [''],
      tagsInput: [''],
      isActive: [true],
      isPerishable: [false],
      manufacturedDate: [''],
      expiryDate: ['']
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

  onCategoryChange(): void {
    // Auto-generate SKU when category changes
    if (this.productForm.get('categoryId')?.value && !this.productForm.get('sku')?.value) {
      this.generateSKU();
    }
  }

  generateSKU(): void {
    const categoryId = this.productForm.get('categoryId')?.value;
    if (categoryId) {
      const sku = this.productService.generateSKU(categoryId);
      this.productForm.patchValue({ sku });
    }
  }

  generateBarcode(): void {
    const barcode = this.productService.generateBarcode();
    this.productForm.patchValue({ barcode });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.productForm.value;
      
      // Process tags
      const tags = formValue.tagsInput 
        ? formValue.tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
        : [];

      const product: Product = {
        ...formValue,
        tags,
        manufacturedDate: formValue.manufacturedDate ? new Date(formValue.manufacturedDate).toISOString().split('T')[0] : undefined,
        expiryDate: formValue.expiryDate ? new Date(formValue.expiryDate).toISOString().split('T')[0] : undefined
      };

      // Remove tagsInput from the final product object
      delete (product as any).tagsInput;

      this.productService.createProduct(product).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            alert(response.message);
            this.dialogRef.close(true);
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating product:', error);
          alert('Error creating product');
        }
      });
    }
  }
}
