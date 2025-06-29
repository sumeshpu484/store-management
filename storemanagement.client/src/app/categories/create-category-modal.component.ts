import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.interface';

@Component({
  selector: 'app-create-category-modal',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-container">
      <div mat-dialog-title class="modal-header">
        <div class="title-container">
          <mat-icon>add_circle</mat-icon>
          <h2>Create New Category</h2>
        </div>
        <button mat-icon-button mat-dialog-close class="close-button" matTooltip="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div mat-dialog-content class="modal-content">
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
              <input matInput formControlName="code" placeholder="AUTO" readonly>
              <mat-icon matSuffix>qr_code</mat-icon>
              <mat-hint>Auto-generated from category name</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Parent Category</mat-label>
              <mat-select formControlName="parentId" placeholder="Select parent category">
                <mat-option [value]="null">-- Root Category --</mat-option>
                <mat-option *ngFor="let category of parentCategories" [value]="category.id">
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

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Icon Name</mat-label>
              <input matInput formControlName="iconName" placeholder="e.g., category, folder">
              <mat-icon matSuffix>emoji_symbols</mat-icon>
              <mat-hint>Material Design icon name</mat-hint>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Color Code</mat-label>
              <input matInput formControlName="colorCode" placeholder="e.g., #2196F3" pattern="^#[0-9A-Fa-f]{6}$">
              <mat-icon matSuffix>palette</mat-icon>
              <mat-error *ngIf="categoryForm.get('colorCode')?.hasError('pattern')">
                Please enter a valid hex color code (e.g., #2196F3)
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

          <!-- SEO Section -->
          <div class="seo-section">
            <h3 class="section-title">
              <mat-icon>search</mat-icon>
              SEO Information (Optional)
            </h3>
            
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
                         rows="2"></textarea>
                <mat-icon matSuffix>description</mat-icon>
                <mat-error *ngIf="categoryForm.get('metaDescription')?.hasError('maxlength')">
                  Meta description cannot exceed 160 characters
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL Slug</mat-label>
                <input matInput formControlName="slug" placeholder="url-friendly-slug" readonly>
                <mat-icon matSuffix>link</mat-icon>
                <mat-hint>Auto-generated from category name</mat-hint>
              </mat-form-field>
            </div>
          </div>
        </form>
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
          <mat-icon *ngIf="!isSubmitting">add_circle</mat-icon>
          <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
          {{ isSubmitting ? 'Creating...' : 'Create Category' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      width: 100%;
      max-width: 800px;
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
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
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

    .seo-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
      margin: 0 0 16px 0;
    }

    .section-title mat-icon {
      color: #667eea;
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

    .mat-mdc-form-field .mat-mdc-form-field-subscript-wrapper {
      margin-top: 4px;
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

      .modal-content {
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
export class CreateCategoryModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateCategoryModalComponent>);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  categoryForm!: FormGroup;
  parentCategories: Category[] = [];
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
    this.loadParentCategories();
    this.setupFormValueChanges();
  }

  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      code: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
      parentId: [null],
      sortOrder: [1, [Validators.min(1), Validators.max(999)]],
      iconName: ['category'],
      colorCode: ['#2196F3', Validators.pattern(/^#[0-9A-Fa-f]{6}$/)],
      metaTitle: ['', Validators.maxLength(60)],
      metaDescription: ['', Validators.maxLength(160)],
      slug: [''],
      isActive: [true]
    });
  }

  private loadParentCategories(): void {
    this.categoryService.getParentCategories().subscribe({
      next: (response: any) => {
        if (response.success && response.categories) {
          // Only show active root categories as potential parents
          this.parentCategories = response.categories.filter((cat: any) => 
            cat.isActive && cat.level === 1
          );
        }
      },
      error: (error: any) => {
        console.error('Error loading parent categories:', error);
        this.snackBar.open('Failed to load parent categories', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private setupFormValueChanges(): void {
    // Auto-generate code from name
    this.categoryForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const code = this.generateCategoryCode(name);
        this.categoryForm.get('code')?.setValue(code, { emitEvent: false });
        
        // Auto-generate slug
        const slug = this.generateSlug(name);
        this.categoryForm.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });

    // Update sort order when parent changes
    this.categoryForm.get('parentId')?.valueChanges.subscribe((parentId: any) => {
      if (parentId) {
        // Set default sort order for child categories
        this.categoryForm.get('sortOrder')?.setValue(1, { emitEvent: false });
      } else {
        // Root category - set default sort order
        this.categoryForm.get('sortOrder')?.setValue(1, { emitEvent: false });
      }
    });
  }

  private generateCategoryCode(name: string): string {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8);
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
      slug: formValue.slug,
      isActive: formValue.isActive
    };

    this.categoryService.createCategory(categoryData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          this.snackBar.open('Category created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(response.category);
        } else {
          this.snackBar.open(response.message || 'Failed to create category', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Error creating category:', error);
        this.snackBar.open('Failed to create category. Please try again.', 'Close', {
          duration: 3000,
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
