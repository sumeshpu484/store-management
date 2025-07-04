import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreApiService, StoreUser } from '../services/store-api.service';

@Component({
  selector: 'app-edit-user-modal',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>edit</mat-icon>
        Edit User
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <form [formGroup]="userForm" class="user-form">
        <!-- User Information -->
        <div class="form-section">
          <h3>User Information</h3>
          
          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Username *</mat-label>
              <input matInput formControlName="username" placeholder="Enter username">
              <mat-error *ngIf="userForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
              <mat-error *ngIf="userForm.get('username')?.hasError('minlength')">
                Username must be at least 3 characters long
              </mat-error>
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Email *</mat-label>
              <input matInput type="email" formControlName="email" placeholder="user@example.com">
              <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="Enter first name">
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Enter last name">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>Role *</mat-label>
              <mat-select formControlName="role">
                <mat-option value="maker">Maker</mat-option>
                <mat-option value="checker">Checker</mat-option>
              </mat-select>
              <mat-error *ngIf="userForm.get('role')?.hasError('required')">
                Role is required
              </mat-error>
            </mat-form-field>

            <div class="half-width checkbox-container">
              <mat-checkbox formControlName="isActive">
                Active User
              </mat-checkbox>
            </div>
          </div>
        </div>

        <!-- Store Information (Read-only) -->
        <div class="form-section">
          <h3>Store Information</h3>
          <div class="readonly-info">
            <div class="info-item">
              <strong>Store Key:</strong> {{ user.storeKey }}
            </div>
            <div class="info-item">
              <strong>Store ID:</strong> {{ user.storeId }}
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="cancel-btn">Cancel</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSubmit()" 
              [disabled]="userForm.invalid || isSubmitting"
              class="submit-btn">
        <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
        <mat-icon *ngIf="!isSubmitting">save</mat-icon>
        {{ isSubmitting ? 'Updating...' : 'Update User' }}
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

    .user-form {
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

    .half-width {
      width: calc(50% - 8px);
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      padding-top: 8px;
    }

    .readonly-info {
      background: #f0f0f0;
      border-radius: 6px;
      padding: 16px;
    }

    .info-item {
      margin: 8px 0;
      color: #666;
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

    .submit-btn mat-spinner {
      margin-right: 4px;
    }

    .submit-btn mat-icon,
    .submit-btn mat-spinner {
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
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
export class EditUserModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreApiService);
  private readonly dialogRef = inject(MatDialogRef<EditUserModalComponent>);
  private readonly snackBar = inject(MatSnackBar);

  userForm!: FormGroup;
  isSubmitting = false;
  user: StoreUser;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: StoreUser }) {
    this.user = data.user;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      role: ['', [Validators.required]],
      isActive: [true]
    });
  }

  private populateForm(): void {
    this.userForm.patchValue({
      username: this.user.username,
      email: this.user.email,
      firstName: this.user.firstName || '',
      lastName: this.user.lastName || '',
      role: this.user.role,
      isActive: this.user.isActive
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData = this.userForm.value;
      const userId = this.user.user_id || this.user.userId || this.user.id;
      
      if (!userId) {
        this.isSubmitting = false;
        this.snackBar.open('❌ User ID not found', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.storeService.updateUser(userId, userData).subscribe({
        next: (response:any) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open(`✅ User "${userData.username}" updated successfully!`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          } else {
            this.snackBar.open(`❌ ${response.message}`, 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error:any) => {
          this.isSubmitting = false;
          console.error('Error updating user:', error);
          this.snackBar.open('❌ Failed to update user. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
