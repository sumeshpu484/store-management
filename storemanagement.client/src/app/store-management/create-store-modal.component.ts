import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreService } from '../services/store.service';
import { CreateStoreRequest } from '../models/store.interface';

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
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phone" placeholder="+1-555-0123">
          <mat-icon matSuffix>phone</mat-icon>
          <mat-error *ngIf="storeForm.get('phone')?.hasError('required')">
            Phone number is required
          </mat-error>
          <mat-error *ngIf="storeForm.get('phone')?.hasError('pattern')">
            Please enter a valid phone number
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Store Key (8 digits)</mat-label>
          <input matInput formControlName="storeKey" placeholder="12345678" maxlength="8">
          <mat-icon matSuffix>vpn_key</mat-icon>
          <button matSuffix mat-icon-button type="button" (click)="generateStoreKey()" 
                  matTooltip="Generate random store key">
            <mat-icon>refresh</mat-icon>
          </button>
          <mat-error *ngIf="storeForm.get('storeKey')?.hasError('required')">
            Store key is required
          </mat-error>
          <mat-error *ngIf="storeForm.get('storeKey')?.hasError('pattern')">
            Store key must be exactly 8 digits
          </mat-error>
        </mat-form-field>

        <div class="info-box">
          <mat-icon>info</mat-icon>
          <div class="info-content">
            <strong>Note:</strong> Default maker and checker users will be automatically created:
            <ul>
              <li><code>maker_{{ storeForm.get('storeKey')?.value || 'XXXXXXXX' }}</code></li>
              <li><code>checker_{{ storeForm.get('storeKey')?.value || 'XXXXXXXX' }}</code></li>
            </ul>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()" 
              [disabled]="storeForm.invalid || isLoading">
        <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
        <mat-icon *ngIf="!isLoading">add</mat-icon>
        {{ isLoading ? 'Creating...' : 'Create Store' }}
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

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class CreateStoreModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateStoreModalComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreService);

  isLoading = false;

  storeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
    storeKey: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
  });

  constructor() {
    this.generateStoreKey();
  }

  generateStoreKey(): void {
    const randomKey = Math.floor(10000000 + Math.random() * 90000000).toString();
    this.storeForm.patchValue({ storeKey: randomKey });
  }

  async onSubmit(): Promise<void> {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    try {
      const formValue = this.storeForm.value;
      const createRequest: CreateStoreRequest = {
        name: formValue.name!,
        address: formValue.address!,
        phone: formValue.phone!,
        storeKey: formValue.storeKey!
      };

      this.storeService.createStore(createRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(response.store);
            alert('Store created successfully with default maker and checker users!');
          } else {
            alert('Error creating store: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating store:', error);
          alert('Failed to create store. Please try again.');
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Failed to create store. Please try again.');
      this.isLoading = false;
    }
  }
}
