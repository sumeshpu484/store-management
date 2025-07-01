import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.interface';

@Component({
  selector: 'app-edit-store-modal',
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
        <mat-icon>edit_location</mat-icon>
        Edit Store
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <div class="store-form-container">
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
            <input matInput formControlName="phone" placeholder="+91-XXXXXXXXXX">
            <mat-icon matSuffix>phone</mat-icon>
            <mat-error *ngIf="storeForm.get('phone')?.hasError('required')">
              Phone number is required
            </mat-error>
            <mat-error *ngIf="storeForm.get('phone')?.hasError('pattern')">
              Phone number must be in format: +91-XXXXXXXXXX (10 digits starting with 6-9)
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Store Key (6+ alphanumeric)</mat-label>
            <input matInput formControlName="storeKey" placeholder="ABC123" minlength="6" style="text-transform: uppercase;">
            <mat-icon matSuffix>vpn_key</mat-icon>
            <mat-error *ngIf="storeForm.get('storeKey')?.hasError('required')">
              Store key is required
            </mat-error>
            <mat-error *ngIf="storeForm.get('storeKey')?.hasError('pattern')">
              Store key must be at least 6 alphanumeric characters
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" 
                    (click)="updateStore()" 
                    [disabled]="storeForm.invalid || isLoading"
                    class="update-btn">
              <div class="btn-content">
                <mat-spinner diameter="20" *ngIf="isLoading" class="btn-spinner"></mat-spinner>
                <mat-icon *ngIf="!isLoading" class="btn-icon">update</mat-icon>
                <span>{{ isLoading ? 'Updating...' : 'Update Store' }}</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close>Close</button>
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

    .modal-header mat-icon {
      color: #667eea;
    }

    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .modal-content {
      width: 100%;
      padding: 0 24px;
    }

    .store-form-container {
      padding: 0;
    }

    .store-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    .update-btn {
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

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px 24px 24px;
      margin-top: 0;
    }
  `]
})
export class EditStoreModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<EditStoreModalComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreService);
  private readonly snackBar = inject(MatSnackBar);

  store: Store;
  isLoading = false;

  storeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+91-[6-9]\d{9}$/)]],
    storeKey: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,}$/)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { store: Store }) {
    this.store = data.store;
  }

  ngOnInit(): void {
    this.loadStoreDetails();
  }

  private loadStoreDetails(): void {
    this.storeForm.patchValue({
      name: this.store.name,
      address: this.store.address,
      email: this.store.email,
      phone: this.store.phone,
      storeKey: this.store.storeKey
    });
  }

  updateStore(): void {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    const formValue = this.storeForm.value;
    const updateData = {
      name: formValue.name!,
      address: formValue.address!,
      email: formValue.email!,
      phone: formValue.phone!,
      storeKey: formValue.storeKey!.toUpperCase()
    };

    this.storeService.updateStore(this.store.id!, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.store = { ...this.store, ...updateData };
          this.snackBar.open(`✅ Store "${updateData.name}" updated successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open(`❌ ${response.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating store:', error);
        this.snackBar.open('❌ Failed to update store. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
}
