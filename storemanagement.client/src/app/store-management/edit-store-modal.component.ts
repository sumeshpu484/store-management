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
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreApiService, Store, StoreRequest } from '../services/store-api.service';
import { HttpClient } from '@angular/common/http';

// Interfaces for state/city data
interface City {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  cities: City[];
}

interface StatesCitiesConfig {
  states: State[];
}

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
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule
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

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>State</mat-label>
              <mat-select formControlName="state" (selectionChange)="onStateChange($event.value)">
                <mat-option *ngFor="let state of availableStates" [value]="state.name">
                  {{ state.name }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>map</mat-icon>
              <mat-error *ngIf="storeForm.get('state')?.hasError('required')">
                State is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>City</mat-label>
              <mat-select formControlName="city" [disabled]="!storeForm.get('state')?.value" (selectionChange)="onCityChange($event.value)">
                <mat-option *ngFor="let city of availableCities" [value]="city.name">
                  {{ city.name }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>location_city</mat-icon>
              <mat-error *ngIf="storeForm.get('city')?.hasError('required')">
                City is required
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ZIP Code</mat-label>
            <input matInput formControlName="zipCode" placeholder="Enter 6-digit ZIP code" maxlength="6">
            <mat-icon matSuffix>local_post_office</mat-icon>
            <mat-error *ngIf="storeForm.get('zipCode')?.hasError('required')">
              ZIP code is required
            </mat-error>
            <mat-error *ngIf="storeForm.get('zipCode')?.hasError('pattern')">
              ZIP code must be 6 digits
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
            <input matInput formControlName="phone" placeholder="96666-87778 or +91-9666687778" (blur)="formatPhoneNumber()">
            <mat-icon matSuffix>phone</mat-icon>
            <mat-error *ngIf="storeForm.get('phone')?.hasError('required')">
              Phone number is required
            </mat-error>
            <mat-error *ngIf="storeForm.get('phone')?.hasError('pattern')">
              Please enter a valid Indian phone number (e.g., 96666-87778 or +91-9666687778)
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width store-key-field">
            <mat-label>Store Key (6 alphanumeric)</mat-label>
            <input matInput formControlName="storeKey" placeholder="ABC123" minlength="6" 
                   style="text-transform: uppercase;" class="store-key-input">
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

    .form-row {
      display: flex;
      gap: 16px;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .update-btn {
      min-width: 140px;
      height: 42px;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
      transition: all 0.3s ease;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .update-btn:hover:not(:disabled) {
      background: linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%);
      box-shadow: 0 5px 11px -1px rgba(0,0,0,.2), 0 8px 14px 0 rgba(0,0,0,.14), 0 3px 20px 0 rgba(0,0,0,.12);
      transform: translateY(-1px);
    }

    .update-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      color: white;
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
      gap: 12px;
      padding: 16px 24px 24px 24px;
      margin-top: 0;
    }

    .modal-actions button[mat-button] {
      min-width: 100px;
      height: 42px;
      border-radius: 8px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .modal-actions button[mat-button]:hover {
      background-color: rgba(0,0,0,0.04);
      transform: translateY(-1px);
    }

    /* Store Key Field Styling */
    .store-key-field .mat-mdc-form-field-input-control input.store-key-input {
      color: #667eea !important;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }

    .store-key-field .mat-mdc-form-field-input-control input.store-key-input::placeholder {
      color: #667eea80 !important;
      font-weight: 500;
    }

    .store-key-field .mdc-text-field--focused .mat-mdc-form-field-input-control input.store-key-input {
      color: #5a67d8 !important;
    }
  `]
})
export class EditStoreModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<EditStoreModalComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly http = inject(HttpClient);

  store: Store;
  isLoading = false;
  statesCitiesConfig: StatesCitiesConfig | null = null;
  availableStates: State[] = [];
  availableCities: City[] = [];

  storeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+91-?)?[6-9]\d{4}-?\d{5}$/)]],
    storeKey: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,}$/)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { store: Store }) {
    this.store = data.store;
  }

  ngOnInit(): void {
    this.loadStatesCitiesConfig();
    this.loadStoreDetails();
  }

  async loadStatesCitiesConfig(): Promise<void> {
    try {
      const config = await this.http.get<StatesCitiesConfig>('/assets/config/states-cities.json').toPromise();
      this.statesCitiesConfig = config || null;
      this.availableStates = this.statesCitiesConfig?.states || [];
    } catch (error) {
      console.error('Error loading states/cities config:', error);
      this.snackBar.open('Failed to load location data', 'Close', { duration: 3000 });
    }
  }

  onStateChange(stateName: string): void {
    const selectedState = this.availableStates.find(state => state.name === stateName);
    this.availableCities = selectedState?.cities || [];
    
    // Reset city and zipCode when state changes
    this.storeForm.patchValue({
      city: '',
      zipCode: ''
    });
  }

  onCityChange(cityName: string): void {
    const selectedCity = this.availableCities.find(city => city.name === cityName);
    // Reset zipCode when city changes
    this.storeForm.patchValue({
      zipCode: ''
    });
  }

  generateStoreKey(): void {
    const generatedKey = this.storeService.generateStoreKey();
    this.storeForm.patchValue({ storeKey: generatedKey });
  }

  formatPhoneNumber(): void {
    const phoneControl = this.storeForm.get('phone');
    if (phoneControl?.value) {
      let phone = phoneControl.value.replace(/\D/g, ''); // Remove all non-digits
      
      // If it's an 11-digit number starting with 91, format as +91-XXXXXXXXXX
      if (phone.length === 12 && phone.startsWith('91')) {
        const formatted = `+91-${phone.substring(2, 7)}-${phone.substring(7)}`;
        phoneControl.setValue(formatted);
      }
      // If it's a 10-digit number starting with 6-9, format as XXXXX-XXXXX
      else if (phone.length === 10 && /^[6-9]/.test(phone)) {
        const formatted = `${phone.substring(0, 5)}-${phone.substring(5)}`;
        phoneControl.setValue(formatted);
      }
      // If it already has +91 prefix, ensure proper formatting
      else if (phoneControl.value.startsWith('+91')) {
        const digitsOnly = phone.length === 12 ? phone.substring(2) : phone;
        if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
          const formatted = `+91-${digitsOnly.substring(0, 5)}-${digitsOnly.substring(5)}`;
          phoneControl.setValue(formatted);
        }
      }
    }
  }

  private loadStoreDetails(): void {
    this.storeForm.patchValue({
      name: this.store.name,
      address: this.store.address,
      city: this.store.city,
      state: this.store.state,
      zipCode: this.store.zipCode,
      email: this.store.email,
      phone: this.store.phone,
      storeKey: this.store.storeKey
    });

    // Load cities for the selected state
    if (this.store.state) {
      const selectedState = this.availableStates.find(state => state.name === this.store.state);
      this.availableCities = selectedState?.cities || [];
    }
  }

  updateStore(): void {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    const formValue = this.storeForm.value;
    const updateData: StoreRequest = {
      storeName: formValue.name!,
      address: formValue.address!,
      city: formValue.city!,
      state: formValue.state!,
      zipCode: formValue.zipCode!,
      storeEmail: formValue.email!,
      phone: formValue.phone!,
      storeKey: formValue.storeKey!.toUpperCase(),
      isActive: this.store.isActive
    };

    this.storeService.updateStore(this.store.id!, updateData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.store = { ...this.store, ...updateData, name: updateData.storeName, email: updateData.storeEmail };
          this.snackBar.open(`✅ Store "${updateData.storeName}" updated successfully!`, 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(this.store);
        } else {
          this.snackBar.open(`❌ ${response.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
        this.isLoading = false;
      },
      error: (error: any) => {
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
