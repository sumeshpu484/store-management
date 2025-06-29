import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { StoreService } from '../services/store.service';
import { Store, StoreUser, CreateUserRequest, ChangePasswordRequest } from '../models/store.interface';

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
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatChipsModule
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
      <mat-tab-group>
        <!-- Store Details Tab -->
        <mat-tab label="Store Details">
          <div class="tab-content">
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
                <mat-error *ngIf="storeForm.get('storeKey')?.hasError('required')">
                  Store key is required
                </mat-error>
                <mat-error *ngIf="storeForm.get('storeKey')?.hasError('pattern')">
                  Store key must be exactly 8 digits
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" 
                        (click)="updateStore()" 
                        [disabled]="storeForm.invalid || isLoading">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon *ngIf="!isLoading">update</mat-icon>
                  {{ isLoading ? 'Updating...' : 'Update Store' }}
                </button>
              </div>
            </form>
          </div>
        </mat-tab>

        <!-- Users Management Tab -->
        <mat-tab label="Users Management">
          <div class="tab-content">
            <!-- Add User Section -->
            <div class="add-user-section">
              <h3>
                <mat-icon>person_add</mat-icon>
                Add New User
              </h3>
              <form [formGroup]="userForm" class="user-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="First name">
                    <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
                      First name is required
                    </mat-error>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Last name">
                    <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
                      Last name is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Username</mat-label>
                    <input matInput formControlName="username" placeholder="Username">
                    <mat-error *ngIf="userForm.get('username')?.hasError('required')">
                      Username is required
                    </mat-error>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" placeholder="email@example.com" type="email">
                    <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                      Please enter a valid email
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Role</mat-label>
                    <mat-select formControlName="role">
                      <mat-option value="maker">Maker</mat-option>
                      <mat-option value="checker">Checker</mat-option>
                      <mat-option value="admin">Admin</mat-option>
                      <mat-option value="staff">Staff</mat-option>
                    </mat-select>
                    <mat-error *ngIf="userForm.get('role')?.hasError('required')">
                      Role is required
                    </mat-error>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Password</mat-label>
                    <input matInput formControlName="password" placeholder="Password" type="password">
                    <mat-error *ngIf="userForm.get('password')?.hasError('required')">
                      Password is required
                    </mat-error>
                    <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
                      Password must be at least 6 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button mat-raised-button color="accent" 
                          (click)="addUser()" 
                          [disabled]="userForm.invalid || isAddingUser">
                    <mat-spinner diameter="20" *ngIf="isAddingUser"></mat-spinner>
                    <mat-icon *ngIf="!isAddingUser">person_add</mat-icon>
                    {{ isAddingUser ? 'Adding...' : 'Add User' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Users List -->
            <div class="users-list-section">
              <h3>
                <mat-icon>group</mat-icon>
                Store Users ({{ storeUsers.length }})
              </h3>
              
              <div class="table-container" *ngIf="storeUsers.length > 0">
                <table mat-table [dataSource]="usersDataSource" class="users-table">
                  <!-- Name Column -->
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Name</th>
                    <td mat-cell *matCellDef="let user">
                      <div class="user-name">
                        <mat-icon class="user-icon">person</mat-icon>
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                    </td>
                  </ng-container>

                  <!-- Username Column -->
                  <ng-container matColumnDef="username">
                    <th mat-header-cell *matHeaderCellDef>Username</th>
                    <td mat-cell *matCellDef="let user">
                      <code>{{ user.username }}</code>
                    </td>
                  </ng-container>

                  <!-- Email Column -->
                  <ng-container matColumnDef="email">
                    <th mat-header-cell *matHeaderCellDef>Email</th>
                    <td mat-cell *matCellDef="let user">{{ user.email }}</td>
                  </ng-container>

                  <!-- Role Column -->
                  <ng-container matColumnDef="role">
                    <th mat-header-cell *matHeaderCellDef>Role</th>
                    <td mat-cell *matCellDef="let user">
                      <mat-chip [ngClass]="'role-' + user.role">
                        {{ user.role | titlecase }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <!-- Status Column -->
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let user">
                      <mat-slide-toggle 
                        [checked]="user.isActive"
                        (change)="toggleUserStatus(user)">
                      </mat-slide-toggle>
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let user">
                      <button mat-icon-button color="primary" 
                              (click)="changePassword(user)"
                              matTooltip="Change password">
                        <mat-icon>vpn_key</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" 
                              (click)="deleteUser(user)"
                              matTooltip="Delete user"
                              [disabled]="user.role === 'maker' || user.role === 'checker'">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="userDisplayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: userDisplayedColumns;"></tr>
                </table>
              </div>

              <div class="no-users" *ngIf="storeUsers.length === 0">
                <mat-icon>group_off</mat-icon>
                <p>No users found for this store</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
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
      min-width: 700px;
      max-width: 900px;
      max-height: 80vh;
    }

    .tab-content {
      padding: 24px 16px;
    }

    .store-form, .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    .add-user-section {
      margin-bottom: 32px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .add-user-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: #495057;
    }

    .users-list-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: #495057;
    }

    .table-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .users-table {
      width: 100%;
    }

    .user-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-icon {
      color: #666;
    }

    .role-maker {
      background: #e3f2fd;
      color: #1976d2;
    }

    .role-checker {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .role-admin {
      background: #ffebee;
      color: #d32f2f;
    }

    .role-staff {
      background: #e8f5e8;
      color: #388e3c;
    }

    .no-users {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-users mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #bbb;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }

    mat-spinner {
      margin-right: 8px;
    }

    code {
      background: #f5f5f5;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
  `]
})
export class EditStoreModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<EditStoreModalComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly storeService = inject(StoreService);
  private readonly dialog = inject(MatDialog);

  store: Store;
  isLoading = false;
  isAddingUser = false;
  storeUsers: StoreUser[] = [];
  usersDataSource = new MatTableDataSource<StoreUser>([]);
  userDisplayedColumns = ['name', 'username', 'email', 'role', 'status', 'actions'];

  storeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
    storeKey: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
  });

  userForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['staff', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { store: Store }) {
    this.store = data.store;
  }

  ngOnInit(): void {
    this.loadStoreDetails();
    this.loadStoreUsers();
  }

  private loadStoreDetails(): void {
    this.storeForm.patchValue({
      name: this.store.name,
      address: this.store.address,
      phone: this.store.phone,
      storeKey: this.store.storeKey
    });
  }

  private loadStoreUsers(): void {
    // Mock users for demonstration
    this.storeUsers = [
      {
        id: `maker_${this.store.storeKey}`,
        username: `maker_${this.store.storeKey}`,
        email: `maker_${this.store.storeKey}@store.com`,
        firstName: 'Maker',
        lastName: 'User',
        role: 'maker',
        storeId: this.store.id!,
        storeKey: this.store.storeKey,
        isActive: true,
        createdDate: new Date()
      },
      {
        id: `checker_${this.store.storeKey}`,
        username: `checker_${this.store.storeKey}`,
        email: `checker_${this.store.storeKey}@store.com`,
        firstName: 'Checker',
        lastName: 'User',
        role: 'checker',
        storeId: this.store.id!,
        storeKey: this.store.storeKey,
        isActive: true,
        createdDate: new Date()
      }
    ];

    this.usersDataSource.data = this.storeUsers;
  }

  updateStore(): void {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    const formValue = this.storeForm.value;
    const updateData = {
      name: formValue.name!,
      address: formValue.address!,
      phone: formValue.phone!,
      storeKey: formValue.storeKey!
    };

    this.storeService.updateStore(this.store.id!, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.store = { ...this.store, ...updateData };
          alert('Store updated successfully!');
        } else {
          alert('Error updating store: ' + response.message);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating store:', error);
        alert('Failed to update store. Please try again.');
        this.isLoading = false;
      }
    });
  }

  addUser(): void {
    if (this.userForm.invalid) return;

    this.isAddingUser = true;
    const formValue = this.userForm.value;
    const newUser: CreateUserRequest = {
      username: formValue.username!,
      email: formValue.email!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      role: formValue.role as any,
      password: formValue.password!,
      storeId: this.store.id!
    };

    // Mock implementation - in real app, call service
    setTimeout(() => {
      const user: StoreUser = {
        id: `user_${Date.now()}`,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        storeId: newUser.storeId,
        storeKey: this.store.storeKey,
        isActive: true,
        createdDate: new Date()
      };

      this.storeUsers.push(user);
      this.usersDataSource.data = [...this.storeUsers];
      this.userForm.reset({ role: 'staff' });
      this.isAddingUser = false;
      alert('User added successfully!');
    }, 1000);
  }

  toggleUserStatus(user: StoreUser): void {
    user.isActive = !user.isActive;
    alert(`User ${user.username} ${user.isActive ? 'activated' : 'deactivated'}`);
  }

  changePassword(user: StoreUser): void {
    const newPassword = prompt(`Enter new password for ${user.username}:`);
    if (newPassword && newPassword.length >= 6) {
      // Mock implementation
      alert(`Password changed successfully for ${user.username}`);
    } else if (newPassword) {
      alert('Password must be at least 6 characters long');
    }
  }

  deleteUser(user: StoreUser): void {
    if (user.role === 'maker' || user.role === 'checker') {
      alert('Cannot delete default maker or checker users');
      return;
    }

    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      const index = this.storeUsers.findIndex(u => u.id === user.id);
      if (index > -1) {
        this.storeUsers.splice(index, 1);
        this.usersDataSource.data = [...this.storeUsers];
        alert('User deleted successfully');
      }
    }
  }
}
