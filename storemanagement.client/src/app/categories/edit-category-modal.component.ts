import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.interface';

@Component({
  selector: 'app-edit-category-modal',
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
    MatSlideToggleModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="modal-container">
      <div mat-dialog-title class="modal-header">
        <div class="title-container">
          <mat-icon>edit</mat-icon>
          <h2>Edit Category</h2>
        </div>
        <button mat-icon-button mat-dialog-close class="close-button" matTooltip="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div mat-dialog-content class="modal-content">
        <mat-tab-group>
          <!-- Basic Information Tab -->
          <mat-tab label="Basic Information">
            <div class="tab-content">
              <form [formGroup]="categoryForm" class="category-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Category Name *</mat-label>
                    <input matInput formControlName="name" placeholder="Enter category name">
                    <mat-icon matSuffix>label</mat-icon>
                    <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                      Category name is required
                    </mat-error>
                    <mat-error *ngIf="categoryForm.get('name')?.hasError('minlength')">
                      Name must be at least 2 characters long
                    </mat-error>
                    <mat-error *ngIf="categoryForm.get('name')?.hasError('maxlength')">
                      Name cannot exceed 100 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Category Code *</mat-label>
                    <input matInput formControlName="code" placeholder="Category code">
                    <mat-icon matSuffix>qr_code</mat-icon>
                    <mat-error *ngIf="categoryForm.get('code')?.hasError('required')">
                      Category code is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Parent Category</mat-label>
                    <mat-select formControlName="parentId" placeholder="Select parent category">
                      <mat-option [value]="null">-- Root Category --</mat-option>
                      <mat-option *ngFor="let category of parentCategories" 
                                  [value]="category.id"
                                  [disabled]="category.id === data.category.id">
                        {{ category.name }}
                      </mat-option>
                    </mat-select>
                    <mat-icon matSuffix>account_tree</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" 
                             placeholder="Enter category description" 
                             rows="3"></textarea>
                    <mat-icon matSuffix>description</mat-icon>
                    <mat-error *ngIf="categoryForm.get('description')?.hasError('maxlength')">
                      Description cannot exceed 500 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Sort Order</mat-label>
                    <input matInput type="number" formControlName="sortOrder" 
                           placeholder="Enter sort order" min="1" max="999">
                    <mat-icon matSuffix>sort</mat-icon>
                    <mat-error *ngIf="categoryForm.get('sortOrder')?.hasError('min')">
                      Sort order must be at least 1
                    </mat-error>
                    <mat-error *ngIf="categoryForm.get('sortOrder')?.hasError('max')">
                      Sort order cannot exceed 999
                    </mat-error>
                  </mat-form-field>

                  <div class="half-width status-toggle">
                    <mat-slide-toggle formControlName="isActive" class="status-switch">
                      <span class="toggle-label">
                        Category Status: 
                        <strong>{{ categoryForm.get('isActive')?.value ? 'Active' : 'Inactive' }}</strong>
                      </span>
                    </mat-slide-toggle>
                  </div>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Appearance Tab -->
          <mat-tab label="Appearance">
            <div class="tab-content">
              <form [formGroup]="categoryForm" class="category-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Icon Name</mat-label>
                    <input matInput formControlName="iconName" placeholder="e.g., category, folder">
                    <mat-icon matSuffix>emoji_symbols</mat-icon>
                    <mat-hint>Material Design icon name</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Color Code</mat-label>
                    <input matInput formControlName="colorCode" placeholder="e.g., #2196F3" pattern="^#[0-9A-Fa-f]{6}$">
                    <mat-icon matSuffix>palette</mat-icon>
                    <mat-error *ngIf="categoryForm.get('colorCode')?.hasError('pattern')">
                      Please enter a valid hex color code (e.g., #2196F3)
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="color-preview" *ngIf="categoryForm.get('colorCode')?.value">
                  <h3>Preview</h3>
                  <div class="preview-chip" [style.background-color]="categoryForm.get('colorCode')?.value">
                    <mat-icon>{{ categoryForm.get('iconName')?.value || 'category' }}</mat-icon>
                    {{ categoryForm.get('name')?.value || 'Category Name' }}
                  </div>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- SEO Information Tab -->
          <mat-tab label="SEO">
            <div class="tab-content">
              <form [formGroup]="categoryForm" class="category-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Meta Title</mat-label>
                    <input matInput formControlName="metaTitle" placeholder="SEO meta title">
                    <mat-icon matSuffix>title</mat-icon>
                    <mat-error *ngIf="categoryForm.get('metaTitle')?.hasError('maxlength')">
                      Meta title cannot exceed 60 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Meta Description</mat-label>
                    <textarea matInput formControlName="metaDescription" 
                             placeholder="SEO meta description" 
                             rows="3"></textarea>
                    <mat-icon matSuffix>description</mat-icon>
                    <mat-error *ngIf="categoryForm.get('metaDescription')?.hasError('maxlength')">
                      Meta description cannot exceed 160 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>URL Slug</mat-label>
                    <input matInput formControlName="slug" placeholder="url-friendly-slug">
                    <mat-icon matSuffix>link</mat-icon>
                    <mat-hint>URL-friendly version of the category name</mat-hint>
                  </mat-form-field>
                </div>
              </form>
            </div>
          </mat-tab>

          <!-- Category Info Tab -->
          <mat-tab label="Information">
            <div class="tab-content">
              <div class="info-section">
                <h3>Category Statistics</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <mat-icon>inventory</mat-icon>
                    <div class="info-details">
                      <span class="info-label">Total Products</span>
                      <span class="info-value">{{ data.category.totalProducts || 0 }}</span>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <mat-icon>layers</mat-icon>
                    <div class="info-details">
                      <span class="info-label">Level</span>
                      <span class="info-value">{{ data.category.level === 1 ? 'Root Category' : 'Sub Category (Level ' + data.category.level + ')' }}</span>
                    </div>
                  </div>

                  <div class="info-item" *ngIf="data.category.parentName">
                    <mat-icon>account_tree</mat-icon>
                    <div class="info-details">
                      <span class="info-label">Parent Category</span>
                      <span class="info-value">{{ data.category.parentName }}</span>
                    </div>
                  </div>
                </div>

                <div class="timestamp-info" *ngIf="data.category.createdAt">
                  <h4>Timestamps</h4>
                  <div class="timestamp-grid">
                    <div class="timestamp-item">
                      <span class="timestamp-label">Created:</span>
                      <span class="timestamp-value">{{ data.category.createdAt | date:'medium' }}</span>
                    </div>
                    <div class="timestamp-item" *ngIf="data.category.updatedAt">
                      <span class="timestamp-label">Last Updated:</span>
                      <span class="timestamp-value">{{ data.category.updatedAt | date:'medium' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <div mat-dialog-actions class="modal-actions">
        <button mat-button type="button" mat-dialog-close class="cancel-btn">
          <mat-icon>cancel</mat-icon>
          Cancel
        </button>
        <button mat-raised-button color="primary" 
                (click)="onSubmit()" 
                [disabled]="categoryForm.invalid || isSubmitting"
                class="submit-btn">
          <mat-icon *ngIf="!isSubmitting">save</mat-icon>
          <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
          {{ isSubmitting ? 'Updating...' : 'Update Category' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      width: 100%;
      max-width: 900px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 16px;
      margin: 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .title-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-container h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    .title-container mat-icon {
      color: #667eea;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .close-button {
      color: #666;
    }

    .modal-content {
      padding: 0;
      max-height: 70vh;
      overflow-y: auto;
    }

    .tab-content {
      padding: 24px;
    }

    .category-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      width: 100%;
    }

    .full-width {
      flex: 1;
    }

    .half-width {
      flex: 0 0 calc(50% - 8px);
    }

    .status-toggle {
      display: flex;
      align-items: center;
      padding: 16px 0;
    }

    .status-switch {
      width: 100%;
    }

    .toggle-label {
      font-size: 14px;
      color: #333;
    }

    /* Color Preview */
    .color-preview {
      margin-top: 24px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .color-preview h3 {
      margin: 0 0 12px 0;
      font-size: 1rem;
      color: #333;
    }

    .preview-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 16px;
      color: white;
      font-weight: 500;
      font-size: 14px;
    }

    /* Info Section */
    .info-section {
      padding: 0;
    }

    .info-section h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
    }

    .info-grid {
      display: grid;
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .info-item mat-icon {
      color: #667eea;
    }

    .info-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 0.875rem;
      color: #666;
    }

    .info-value {
      font-size: 1rem;
      font-weight: 500;
      color: #333;
    }

    .timestamp-info {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .timestamp-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px 0;
    }

    .timestamp-grid {
      display: grid;
      gap: 8px;
    }

    .timestamp-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .timestamp-label {
      font-size: 0.875rem;
      color: #666;
    }

    .timestamp-value {
      font-size: 0.875rem;
      color: #333;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px 20px;
      margin: 0;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-width: 160px;
      justify-content: center;
    }

    .submit-btn:disabled {
      background: #ccc !important;
      color: #666 !important;
    }

    /* Form Field Customizations */
    .mat-mdc-form-field {
      width: 100%;
    }

    /* Tab Customizations */
    .mat-mdc-tab-group {
      margin: 0;
    }

    .mat-mdc-tab-body-content {
      padding: 0;
      overflow: visible;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .modal-container {
        max-width: 95vw;
      }

      .form-row {
        flex-direction: column;
      }

      .half-width {
        flex: 1;
      }

      .modal-header {
        padding: 16px;
      }

      .tab-content {
        padding: 16px;
      }

      .modal-actions {
        padding: 12px 16px 16px;
        flex-direction: column;
      }

      .cancel-btn,
      .submit-btn {
        width: 100%;
      }
    }
  `]
})
export class EditCategoryModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditCategoryModalComponent>);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  categoryForm!: FormGroup;
  parentCategories: Category[] = [];
  isSubmitting = false;
  originalCategory: Category;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { category: Category }) {
    this.originalCategory = { ...data.category };
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadParentCategories();
    this.setupFormValueChanges();
  }

  private initializeForm(): void {
    const category = this.data.category;
    
    this.categoryForm = this.fb.group({
      name: [category.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      code: [category.code, Validators.required],
      description: [category.description || '', Validators.maxLength(500)],
      parentId: [category.parentId || null],
      sortOrder: [category.sortOrder, [Validators.min(1), Validators.max(999)]],
      iconName: [category.iconName || 'category'],
      colorCode: [category.colorCode || '#2196F3', Validators.pattern(/^#[0-9A-Fa-f]{6}$/)],
      metaTitle: [category.metaTitle || '', Validators.maxLength(60)],
      metaDescription: [category.metaDescription || '', Validators.maxLength(160)],
      slug: [category.slug || ''],
      isActive: [category.isActive]
    });
  }

  private loadParentCategories(): void {
    this.categoryService.getParentCategories().subscribe({
      next: (response: any) => {
        if (response.success && response.categories) {
          // Only show active root categories as potential parents, excluding current category
          this.parentCategories = response.categories.filter((cat: any) => 
            cat.isActive && cat.level === 1 && cat.id !== this.data.category.id
          );
        }
      },
      error: (error: any) => {
        console.error('Error loading parent categories:', error);
        this.snackBar.open('❌ Failed to load parent categories. Some features may be limited.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private setupFormValueChanges(): void {
    // Auto-generate slug from name if slug is empty
    this.categoryForm.get('name')?.valueChanges.subscribe((name: string) => {
      if (name && !this.categoryForm.get('slug')?.value) {
        const slug = this.generateSlug(name);
        this.categoryForm.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.categoryForm.value;
    
    const categoryData: Category = {
      ...this.originalCategory,
      name: formValue.name.trim(),
      description: formValue.description?.trim() || '',
      code: formValue.code,
      parentId: formValue.parentId,
      level: formValue.parentId ? 2 : 1, // Child or root
      sortOrder: formValue.sortOrder,
      iconName: formValue.iconName?.trim() || 'category',
      colorCode: formValue.colorCode,
      metaTitle: formValue.metaTitle?.trim() || '',
      metaDescription: formValue.metaDescription?.trim() || '',
      slug: formValue.slug?.trim() || this.generateSlug(formValue.name),
      isActive: formValue.isActive
    };

    this.categoryService.updateCategory(this.originalCategory.id!, categoryData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          this.snackBar.open(`✅ Category "${categoryData.name}" updated successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(response.category);
        } else {
          this.snackBar.open(`❌ Failed to update category: ${response.message || 'Unknown error'}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Error updating category:', error);
        this.snackBar.open('❌ Failed to update category. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }
}
