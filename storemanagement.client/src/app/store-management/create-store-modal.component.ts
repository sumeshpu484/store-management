import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreApiService, CreateStoreRequest } from '../services/store-api.service';

@Component({
  selector: 'app-create-store-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>add_business</mat-icon>
        Create New Store
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <form [formGroup]="storeForm" class="store-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Store Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter store name">
          <mat-icon matSuffix>business</mat-icon>
          <mat-error *ngIf="storeForm.get('name')?.hasError('required')">
            Store name is required
          </mat-error>
          <mat-error *ngIf="storeForm.get('name')?.hasError('minlength')">
            Store name must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Address</mat-label>
          <textarea matInput formControlName="address" placeholder="Enter store address" rows="3"></textarea>
          <mat-icon matSuffix>location_on</mat-icon>
          <mat-error *ngIf="storeForm.get('address')?.hasError('required')">
            Address is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email Address</mat-label>
          <input matInput type="email" formControlName="email" placeholder="store@example.com">
          <mat-icon matSuffix>email</mat-icon>
          <mat-error *ngIf="storeForm.get('email')?.hasError('required')">
            Email address is required
          </mat-error>
          <mat-error *ngIf="storeForm.get('email')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phone" placeholder="+91-XXXXXXXXXX" (blur)="formatPhoneNumber()">
          <mat-icon matSuffix>phone</mat-icon>
          <mat-error *ngIf="storeForm.get('phone')?.hasError('required')">
            Phone number is required
          </mat-error>
          <mat-error *ngIf="storeForm.get('phone')?.hasError('pattern')">
            Phone number must be in format: +91-XXXXXXXXXX (10 digits starting with 6-9)
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Store Key (6 alphanumeric)</mat-label>            <input matInput formControlName="storeKey" placeholder="ABC123" minlength="6" style="text-transform: uppercase;">
          <mat-icon matSuffix>vpn_key</mat-icon>
          <button matSuffix mat-icon-button type="button" (click)="generateStoreKey()" 
                  matTooltip="Generate random store key">
            <mat-icon>refresh</mat-icon>
          </button>
          <mat-error *ngIf="storeForm.get('storeKey')?.hasError('required')">
            Store key is required
          </mat-error>
          <mat-error *ngIf="storeForm.get('storeKey')?.hasError('pattern')">
            Store key must be at least 6 alphanumeric characters
          </mat-error>
        </mat-form-field>

        <div class="info-box">
          <mat-icon>info</mat-icon>
          <div class="info-content">
            <strong>Note:</strong> Default maker and checker users will be automatically created:
            <ul>
              <li><code>maker_{{ storeForm.get('storeKey')?.value || 'XXXXXX' }}</code></li>
              <li><code>checker_{{ storeForm.get('storeKey')?.value || 'XXXXXX' }}</code></li>
            </ul>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()" 
              [disabled]="storeForm.invalid || isLoading"
              class="create-btn">
        <div class="btn-content">
          <mat-spinner diameter="20" *ngIf="isLoading" class="btn-spinner"></mat-spinner>
          <mat-icon *ngIf="!isLoading" class="btn-icon">add</mat-icon>
          <span>{{ isLoading ? 'Creating...' : 'Create Store' }}</span>
        </div>
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
      gap: 8px;
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
      min-width: 500px;
      max-width: 600px;
    }

    .store-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }

    .create-btn {
      min-width: 140px;
      height: 40px;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
    }

    .btn-spinner,
    .btn-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-spinner {
      margin: 0;
    }

    .btn-icon {
      font-size: 20px;
    }

    .info-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .info-box mat-icon {
      color: #667eea;
      margin-top: 2px;
    }

    .info-content {
      flex: 1;
    }

    .info-content ul {
      margin: 8px 0 0 0;
      padding-left: 16px;
    }

    .info-content code {
      background: #e0e0e0;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
  `]
})
export class CreateStoreModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateStoreModalComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreApiService);
  private readonly snackBar = inject(MatSnackBar);

  isLoading = false;

  storeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+91-[6-9]\d{9}$/)]],
    storeKey: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,}$/)]]
  });

  constructor() {
    this.generateStoreKey();
  }

  generateStoreKey(): void {
    const generatedKey = this.storeService.generateStoreKey();
    this.storeForm.patchValue({ storeKey: generatedKey });
  }

  formatPhoneNumber(): void {
    const phoneControl = this.storeForm.get('phone');
    if (phoneControl?.value) {
      const formatted = this.storeService.formatPhoneNumber(phoneControl.value);
      phoneControl.setValue(formatted);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    try {
      const formValue = this.storeForm.value;
      const createRequest: CreateStoreRequest = {
        storeName: formValue.name!,
        address: formValue.address!,
        email: formValue.email!,
        isActive: true
      };

      this.storeService.createStore(createRequest).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.snackBar.open(`✅ Store "${createRequest.storeName}" created successfully!`, 'Close', {
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(response.store);
          } else {
            this.snackBar.open(`❌ ${response.message}`, 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating store:', error);
          this.snackBar.open('❌ Failed to create store. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error creating store:', error);
      this.snackBar.open('❌ Failed to create store. Please try again.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
    }
  }
}
