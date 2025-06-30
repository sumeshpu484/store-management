import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreService } from '../services/store.service';
import { StoreUser } from '../models/store.interface';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>lock</mat-icon>
        Change Password
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <div class="user-info">
        <p><strong>User:</strong> {{ user.username }}</p>
        <p><strong>Role:</strong> {{ user.role | titlecase }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>

      <form [formGroup]="passwordForm" class="password-form">
        <mat-form-field class="full-width">
          <mat-label>New Password *</mat-label>
          <input matInput 
                 type="password" 
                 formControlName="newPassword" 
                 placeholder="Enter new password">
          <mat-icon matSuffix>lock</mat-icon>
          <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
            New password is required
          </mat-error>
          <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
            Password must be at least 8 characters long
          </mat-error>
          <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('pattern')">
            Password must contain at least one uppercase letter, one lowercase letter, and one number
          </mat-error>
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Confirm Password *</mat-label>
          <input matInput 
                 type="password" 
                 formControlName="confirmPassword" 
                 placeholder="Confirm new password">
          <mat-icon matSuffix>lock_outline</mat-icon>
          <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
            Please confirm your password
          </mat-error>
          <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('mismatch')">
            Passwords do not match
          </mat-error>
        </mat-form-field>

        <div class="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>At least 8 characters long</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one number (0-9)</li>
          </ul>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="cancel-btn">Cancel</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSubmit()" 
              [disabled]="passwordForm.invalid || isSubmitting"
              class="submit-btn">
        <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
        <mat-icon *ngIf="!isSubmitting">save</mat-icon>
        {{ isSubmitting ? 'Changing...' : 'Change Password' }}
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

    .user-info {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .user-info p {
      margin: 4px 0;
      color: #666;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .password-requirements {
      background: #e3f2fd;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }

    .password-requirements h4 {
      margin: 0 0 12px 0;
      color: #1976d2;
      font-size: 14px;
    }

    .password-requirements ul {
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-size: 13px;
    }

    .password-requirements li {
      margin: 4px 0;
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
  `]
})
export class ChangePasswordModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreService);
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordModalComponent>);
  private readonly snackBar = inject(MatSnackBar);

  passwordForm!: FormGroup;
  isSubmitting = false;
  user: StoreUser;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: StoreUser }) {
    this.user = data.user;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]]
    });

    // Add custom validator for password confirmation
    this.passwordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    this.passwordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  private validatePasswordMatch(): void {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    
    if (confirmPassword && newPassword !== confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({ mismatch: true });
    } else if (confirmPassword && newPassword === confirmPassword) {
      const errors = this.passwordForm.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          this.passwordForm.get('confirmPassword')?.setErrors(null);
        }
      }
    }
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      this.storeService.changeUserPassword(this.user.id, newPassword).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.snackBar.open(`✅ ${response.message}`, 'Close', {
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
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error changing password:', error);
          this.snackBar.open('❌ Failed to change password. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
