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
    MatProgressSpinnerModule
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
            <div class="full-width status-toggle">
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

      <div mat-dialog-actions class="modal-actions">
        <button mat-button type="button" mat-dialog-close class="cancel-btn">
          <mat-icon>cancel</mat-icon>
          Cancel
        </button>
        <button mat-raised-button color="primary" 
                (click)="onSubmit()" 
                [disabled]="categoryForm.invalid || isSubmitting"
                [class.loading]="isSubmitting"
                class="submit-btn">
          <mat-icon *ngIf="!isSubmitting" class="btn-icon">save</mat-icon>
          <mat-spinner *ngIf="isSubmitting" diameter="20" class="btn-spinner"></mat-spinner>
          {{ isSubmitting ? 'Updating...' : 'Update Category' }}
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

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 16px;
      padding: 20px 24px 24px;
      margin: 0;
      border-top: 1px solid #e0e0e0;
      background-color: #f8f9fa;
    }

    .cancel-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      color: #666;
      border: 1px solid #ddd;
      background-color: white;
      border-radius: 4px;
      min-height: 40px;
      transition: all 0.2s ease;
    }

    .cancel-btn:hover {
      background-color: #f5f5f5;
      border-color: #999;
    }

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      min-width: 160px;
      min-height: 40px;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .submit-btn:disabled {
      background: #e0e0e0 !important;
      color: #999 !important;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .submit-btn.loading {
      background: linear-gradient(135deg, #5a6fd8 0%, #6b59a2 100%) !important;
      cursor: wait;
      transform: none;
      box-shadow: none;
    }

    .submit-btn .btn-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
    }

    .submit-btn .btn-spinner {
      width: 20px !important;
      height: 20px !important;
      animation: fadeIn 0.3s ease;
    }

    .submit-btn .btn-spinner ::ng-deep circle {
      stroke: white;
      stroke-width: 3;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
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
        padding: 16px;
        flex-direction: row;
        justify-content: space-between;
      }

      .cancel-btn,
      .submit-btn {
        flex: 1;
        min-width: 120px;
      }

      .cancel-btn {
        margin-right: 8px;
      }

      .submit-btn {
        margin-left: 8px;
      }
    }

    @media (max-width: 480px) {
      .modal-actions {
        flex-direction: column;
        gap: 12px;
      }

      .cancel-btn,
      .submit-btn {
        width: 100%;
        margin: 0;
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
  isSubmitting = false;
  originalCategory: Category;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { category: Category }) {
    this.originalCategory = { ...data.category };
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const category = this.data.category;
    
    this.categoryForm = this.fb.group({
      name: [category.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: [category.description || '', Validators.maxLength(500)],
      isActive: [category.isActive]
    });
  }

  private loadParentCategories(): void {
    // No longer need parent categories since we removed hierarchy
  }

  private setupFormValueChanges(): void {
    // Remove all the auto-generation logic since we removed codes and slugs
  }

  private generateSlug(name: string): string {
    // Remove this method since we no longer use slugs  
    return '';
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
