import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreService } from '../services/store.service';
import { Store, CreateUserRequest } from '../models/store.interface';

@Component({
  selector: 'app-create-user-modal',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>person_add</mat-icon>
        Add New User - {{ store.name }}
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <div class="store-info">
        <div class="info-item">
          <mat-icon>business</mat-icon>
          <span><strong>Store:</strong> {{ store.name }}</span>
        </div>
        <div class="info-item">
          <mat-icon>vpn_key</mat-icon>
          <span><strong>Store Key:</strong> {{ store.storeKey }}</span>
        </div>
      </div>

      <form [formGroup]="createUserForm" class="user-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Username *</mat-label>
            <input matInput formControlName="username" placeholder="Enter username">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="createUserForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
            <mat-error *ngIf="createUserForm.get('username')?.hasError('minlength')">
              Username must be at least 3 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Email Address *</mat-label>
            <input matInput type="email" formControlName="email" placeholder="user@example.com">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="createUserForm.get('email')?.hasError('required')">
              Email address is required
            </mat-error>
            <mat-error *ngIf="createUserForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="Enter first name">
            <mat-icon matSuffix>person_outline</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Enter last name">
            <mat-icon matSuffix>person_outline</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Role *</mat-label>
            <mat-select formControlName="role">
              <mat-option value="maker">
                <div class="role-option">
                  <mat-icon>build</mat-icon>
                  <span>Maker</span>
                </div>
              </mat-option>
              <mat-option value="checker">
                <div class="role-option">
                  <mat-icon>verified</mat-icon>
                  <span>Checker</span>
                </div>
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>badge</mat-icon>
            <mat-error *ngIf="createUserForm.get('role')?.hasError('required')">
              Role is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Password *</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" 
                   formControlName="password" 
                   placeholder="Enter password">
            <button mat-icon-button matSuffix 
                    (click)="hidePassword = !hidePassword" 
                    [attr.aria-label]="'Hide password'" 
                    [attr.aria-pressed]="hidePassword">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="createUserForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="createUserForm.get('password')?.hasError('minlength')">
              Password must be at least 8 characters
            </mat-error>
            <mat-error *ngIf="createUserForm.get('password')?.hasError('pattern')">
              Password must contain uppercase, lowercase, and number
            </mat-error>
          </mat-form-field>
        </div>

        <div class="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li [class.valid]="hasMinLength()">At least 8 characters</li>
            <li [class.valid]="hasUppercase()">At least one uppercase letter</li>
            <li [class.valid]="hasLowercase()">At least one lowercase letter</li>
            <li [class.valid]="hasNumber()">At least one number</li>
          </ul>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="cancel-btn">Cancel</button>
      <button mat-raised-button 
              color="primary" 
              (click)="createUser()" 
              [disabled]="createUserForm.invalid || isLoading"
              class="create-btn">
        <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
        <mat-icon *ngIf="!isLoading">person_add</mat-icon>
        {{ isLoading ? 'Creating...' : 'Create User' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-header h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #333;
    }

    .modal-header mat-icon {
      color: #667eea;
    }

    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .modal-content {
      min-width: 550px;
      max-width: 650px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .store-info {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 8px 0;
      color: #555;
    }

    .info-item mat-icon {
      color: #667eea;
      font-size: 20px;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .half-width {
      flex: 1;
    }

    .role-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .password-requirements {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin-top: 8px;
    }

    .password-requirements h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }

    .password-requirements ul {
      margin: 0;
      padding-left: 20px;
      list-style: none;
    }

    .password-requirements li {
      position: relative;
      margin: 4px 0;
      font-size: 13px;
      color: #666;
    }

    .password-requirements li::before {
      content: '✗';
      position: absolute;
      left: -16px;
      color: #f44336;
      font-weight: bold;
    }

    .password-requirements li.valid::before {
      content: '✓';
      color: #4caf50;
    }

    .password-requirements li.valid {
      color: #4caf50;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }

    .cancel-btn {
      color: #666;
    }

    .create-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .create-btn:disabled {
      background: #ccc;
      color: #666;
    }

    mat-spinner {
      margin-right: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-content {
        min-width: auto;
      }
      
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class CreateUserModalComponent implements OnInit {
  private readonly storeService = inject(StoreService);
  private readonly dialogRef = inject(MatDialogRef<CreateUserModalComponent>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  store: Store;
  isLoading = false;
  hidePassword = true;

  createUserForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    role: ['maker', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { store: Store }) {
    this.store = data.store;
  }

  ngOnInit(): void {
    // Component initialized
  }

  hasMinLength(): boolean {
    const password = this.createUserForm.get('password')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.createUserForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.createUserForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.createUserForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  createUser(): void {
    if (this.createUserForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.createUserForm.value;

    const createUserRequest: CreateUserRequest = {
      username: formValue.username!,
      email: formValue.email!,
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      role: formValue.role as 'maker' | 'checker',
      password: formValue.password!,
      storeId: this.store.id!
    };

    this.storeService.createUser(createUserRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.snackBar.open(`✅ ${response.message}`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Close the modal and return success
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(`❌ ${response.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating user:', error);
        this.snackBar.open('❌ Failed to create user. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
