import { Component, inject, Inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreApiService, Store, StoreUser } from '../services/store-api.service';
import { EditUserModalComponent } from './edit-user-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal.component';
import { ConfirmationModalComponent, ConfirmationModalData } from '../shared/confirmation-modal.component';

@Component({
  selector: 'app-manage-users-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>people</mat-icon>
        Manage Users - {{ store.name }}
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <!-- Store Information -->
      <div class="store-info">
        <div class="info-row">
          <strong>Store Key:</strong> 
          <mat-chip class="store-key-chip">{{ store.storeKey }}</mat-chip>
        </div>
        <div class="info-row">
          <strong>Store Name:</strong> {{ store.name }}
        </div>
        <div class="info-row">
          <strong>Address:</strong> {{ store.address }}
        </div>
      </div>

      <!-- Create Users Section -->
      <div class="create-users-section">
        <div class="section-header">
          <h3>
            <mat-icon>people</mat-icon>
            Store Users ({{ usersCount() }})
          </h3>
          <div class="create-user-buttons">
            <button mat-raised-button 
                    (click)="createMakerUser()"
                    [disabled]="isAnyOperationInProgress()"
                    class="create-user-btn create-maker-btn">
              <mat-spinner diameter="16" *ngIf="isCreatingMaker()" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!isCreatingMaker()">person_add</mat-icon>
              {{ isCreatingMaker() ? 'Creating...' : 'Create Maker' }}
            </button>
            <button mat-raised-button 
                    (click)="createCheckerUser()"
                    [disabled]="isAnyOperationInProgress()"
                    class="create-user-btn create-checker-btn">
              <mat-spinner diameter="16" *ngIf="isCreatingChecker()" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!isCreatingChecker()">person_add</mat-icon>
              {{ isCreatingChecker() ? 'Creating...' : 'Create Checker' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-section">
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" class="users-table">
            <!-- Username Column -->
            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef>Username</th>
              <td mat-cell *matCellDef="let user">
                <div class="user-info">
                  <mat-icon class="user-icon">person</mat-icon>
                  <span>{{ user.username }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">
                <div class="email-info">
                  <mat-icon class="email-icon">email</mat-icon>
                  <span>{{ user.email }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Role Column -->
            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [ngClass]="getRoleChipClass(user.role)">
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
                  (change)="toggleUserStatus(user)"
                  [matTooltip]="user.isActive ? 'Active' : 'Inactive'">
                </mat-slide-toggle>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <div class="action-buttons">
                  <button mat-icon-button 
                          color="primary" 
                          (click)="editUser(user)" 
                          matTooltip="Edit user">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button 
                          color="accent" 
                          (click)="changePassword(user)" 
                          matTooltip="Change password">
                    <mat-icon>lock</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="close-btn">Close</button>
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

    .modal-header button {
      width: 40px;
      height: 40px;
      line-height: 1;
    }

    .modal-header button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .modal-header h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #333;
      line-height: 1;
    }

    .modal-header h2 mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .modal-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0 24px;
      min-width: 600px;
    }

    .store-info {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 8px 0;
      color: #666;
      line-height: 1.4;
    }

    .info-row strong {
      min-width: 100px;
      display: inline-block;
    }

    .store-key-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-family: monospace;
      letter-spacing: 1px;
    }

    .users-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .table-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .users-table {
      width: 100%;
    }

    .users-table th {
      font-weight: 600;
      color: #333;
      padding: 12px 16px;
    }

    .users-table td {
      padding: 12px 16px;
      vertical-align: middle;
    }

    .user-info,
    .email-info {
      display: flex;
      align-items: center;
      gap: 8px;
      line-height: 1;
    }

    .user-info span,
    .email-info span {
      line-height: 1.2;
    }

    .user-icon {
      color: #667eea;
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .email-icon {
      color: #1976d2;
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .maker-chip {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      color: white;
    }

    .checker-chip {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
      color: white;
    }

    .create-users-section {
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 500;
      line-height: 1;
    }

    .section-header h3 mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .create-user-buttons {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .create-user-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 500;
      min-width: 140px;
      height: 40px;
      border: none;
      color: white;
      transition: all 0.3s ease;
      line-height: 1;
    }

    .create-user-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .button-spinner {
      width: 16px !important;
      height: 16px !important;
      margin: 0;
    }

    .button-spinner ::ng-deep svg {
      width: 16px !important;
      height: 16px !important;
    }

    .button-spinner ::ng-deep svg circle {
      stroke: white !important;
    }

    .create-maker-btn {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    .create-maker-btn:hover {
      background: linear-gradient(135deg, #43a047 0%, #5cb85c 100%) !important;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      transform: translateY(-1px);
    }

    .create-checker-btn {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%) !important;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
    }

    .create-checker-btn:hover {
      background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%) !important;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
      transform: translateY(-1px);
    }

    .create-maker-btn .mat-mdc-button-touch-target,
    .create-checker-btn .mat-mdc-button-touch-target {
      background: transparent !important;
    }

    .create-user-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .create-user-btn:disabled:hover {
      transform: none !important;
      box-shadow: none !important;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .action-buttons button {
      width: 36px;
      height: 36px;
      line-height: 1;
    }

    .action-buttons button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .modal-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      justify-content: flex-end;
    }

    .close-btn {
      color: #667eea;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-content {
        min-width: auto;
      }
      
      .action-buttons {
        flex-direction: column;
      }

      .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .create-user-buttons {
        width: 100%;
        justify-content: center;
      }

      .create-user-btn {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
})
export class ManageUsersModalComponent implements OnInit {
  private readonly storeService = inject(StoreApiService);
  private readonly dialogRef = inject(MatDialogRef<ManageUsersModalComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['username', 'email', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<StoreUser>([]);
  store: Store;
  
  // Signals for reactive state management
  users = signal<StoreUser[]>([]);
  isCreatingMaker = signal<boolean>(false);
  isCreatingChecker = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  
  // Computed signals
  usersCount = computed(() => this.users().length);
  isAnyOperationInProgress = computed(() => 
    this.isCreatingMaker() || this.isCreatingChecker() || this.isLoading()
  );

  constructor(@Inject(MAT_DIALOG_DATA) public data: { store: Store }) {
    this.store = data.store;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.storeService.getStoreUsers(this.store.id!).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          // Transform users from API format
          const users = Array.isArray(response.data) ? response.data.map((user: any) => ({
            id: user.user_id || user.userId || user.id,
            username: user.user_name || user.username,
            email: user.email,
            firstName: user.first_name || user.firstName || '',
            lastName: user.last_name || user.lastName || '',
            role: user.role_name || user.role || 'user',
            storeId: user.store_id || user.storeId,
            storeKey: user.store_key || user.storeKey,
            isActive: user.is_active !== undefined ? user.is_active : user.isActive !== undefined ? user.isActive : true,
            createdAt: user.created_at ? new Date(user.created_at) : new Date()
          })) : [];
          
          this.users.set(users);
          this.dataSource.data = users;
        }
      },
      error: (error: any) => {
        this.isLoading.set(false);
        console.error('Error loading users:', error);
        this.snackBar.open('❌ Failed to load users', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getRoleChipClass(role: string): string {
    return `${role}-chip`;
  }

  editUser(user: StoreUser): void {
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh the users list
      }
    });
  }

  changePassword(user: StoreUser): void {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Password changed successfully
        // No need to reload users as password change doesn't affect the user list
      }
    });
  }

  toggleUserStatus(user: StoreUser): void {
    const userId = user.user_id || user.userId || user.id;
    if (!userId) {
      this.snackBar.open('❌ User ID not found', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    this.storeService.toggleUserStatus(userId).subscribe({
      next: (response) => {
        if (response.success) {
          const statusText = user.isActive ? 'deactivated' : 'activated';
          this.snackBar.open(`✅ User "${user.username}" ${statusText} successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Update the local data
          user.isActive = !user.isActive;
        } else {
          this.snackBar.open(`❌ ${response.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.snackBar.open(`❌ Failed to update status for "${user.username}". Please try again.`, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  createMakerUser(): void {
    if (this.isAnyOperationInProgress()) return;

    const confirmationData: ConfirmationModalData = {
      title: 'Create Maker User',
      message: `Are you sure you want to create a default maker user for store "${this.store.name}"? This will create a user with role "maker" and default credentials.`,
      confirmText: 'Create Maker',
      cancelText: 'Cancel',
      icon: 'person_add',
      type: 'maker'
    };

    const confirmationRef = this.dialog.open(ConfirmationModalComponent, {
      width: '500px',
      data: confirmationData
    });

    confirmationRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isCreatingMaker.set(true);
        this.storeService.createDefaultMaker(this.store.id!).subscribe({
          next: (response) => {
            this.isCreatingMaker.set(false);
            if (response.success) {
              this.snackBar.open(`✅ ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['success-snackbar']
              });
              this.loadUsers(); // Refresh the users list
            } else {
              this.snackBar.open(`❌ ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (error) => {
            this.isCreatingMaker.set(false);
            console.error('Error creating maker user:', error);
            this.snackBar.open('❌ Failed to create maker user. Please try again.', 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  createCheckerUser(): void {
    if (this.isAnyOperationInProgress()) return;

    const confirmationData: ConfirmationModalData = {
      title: 'Create Checker User',
      message: `Are you sure you want to create a default checker user for store "${this.store.name}"? This will create a user with role "checker" and default credentials.`,
      confirmText: 'Create Checker',
      cancelText: 'Cancel',
      icon: 'person_add',
      type: 'checker'
    };

    const confirmationRef = this.dialog.open(ConfirmationModalComponent, {
      width: '500px',
      data: confirmationData
    });

    confirmationRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isCreatingChecker.set(true);
        this.storeService.createDefaultChecker(this.store.id!).subscribe({
          next: (response) => {
            this.isCreatingChecker.set(false);
            if (response.success) {
              this.snackBar.open(`✅ ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['success-snackbar']
              });
              this.loadUsers(); // Refresh the users list
            } else {
              this.snackBar.open(`❌ ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (error) => {
            this.isCreatingChecker.set(false);
            console.error('Error creating checker user:', error);
            this.snackBar.open('❌ Failed to create checker user. Please try again.', 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}
