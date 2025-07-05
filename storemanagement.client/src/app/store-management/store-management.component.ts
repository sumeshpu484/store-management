import { Component, inject, OnInit, ViewChild, AfterViewInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreApiService } from '../services/store-api.service';
import { Store } from '../services/store-api.service';
import { CreateStoreModalComponent } from './create-store-modal.component';
import { EditStoreModalComponent } from './edit-store-modal.component';
import { StoreDetailsModalComponent } from './store-details-modal.component';
import { ManageUsersModalComponent } from './manage-users-modal.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal.component';

@Component({
  selector: 'app-store-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="store-management-container">
      <!-- Header -->
      <div class="header-section">
        <h1 class="page-title">
          <mat-icon>store</mat-icon>
          Store Management
        </h1>
        <p class="page-subtitle">Manage stores, create default maker and checker users</p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-container">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon total">store</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ storesCount() }}</div>
                <div class="stat-label">Total Stores</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon active">check_circle</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ activeStoresCount() }}</div>
                <div class="stat-label">Active Stores</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon inactive">cancel</mat-icon>
              <div class="stat-details">
                <div class="stat-number">{{ inactiveStoresCount() }}</div>
                <div class="stat-label">Inactive Stores</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Stores List -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <div class="title-container">
                <mat-icon>list</mat-icon>
                <span>Stores List</span>
            </div>
          </mat-card-title>
          <div class="header-actions">
            <div class="search-container">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control search-input" 
                  placeholder="Search by name, key, or phone"
                  (keyup)="applyFilter($event)"
                  aria-label="Search stores">
                <span class="input-group-text">
                  <mat-icon>search</mat-icon>
                </span>
              </div>
            </div>
            <button mat-raised-button color="primary" (click)="openCreateStoreModal()" class="add-btn">
              <mat-icon>add</mat-icon>
              Add Store
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <!-- Loading Spinner -->
          <div *ngIf="isLoading()" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading stores...</p>
          </div>
          
          <div class="table-container" *ngIf="!isLoading()">
            <table mat-table [dataSource]="dataSource" matSort class="stores-table">
              <!-- Store Key Column -->
              <ng-container matColumnDef="storeKey">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Store Key</th>
                <td mat-cell *matCellDef="let store">
                  <mat-chip-set>
                    <mat-chip class="store-key-chip">{{ store.storeKey }}</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Store Name</th>
                <td mat-cell *matCellDef="let store">
                  <div class="store-name">
                    <mat-icon class="store-icon">store</mat-icon>
                    {{ store.name }}
                  </div>
                </td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let store">
                  <div class="email-cell">
                    <mat-icon class="email-icon">email</mat-icon>
                    <a href="mailto:{{ store.email }}" class="email-link">{{ store.email }}</a>
                  </div>
                </td>
              </ng-container>

              <!-- Phone Column -->
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let store">
                  <div class="phone-cell">
                    <mat-icon class="phone-icon">phone</mat-icon>
                    <a href="tel:{{ store.phone }}" class="phone-link">{{ store.phone }}</a>
                  </div>
                </td>
              </ng-container>

              <!-- Address Column -->
              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Address</th>
                <td mat-cell *matCellDef="let store">
                  <div class="address-cell" [matTooltip]="store.address">
                    <mat-icon class="location-icon">location_on</mat-icon>
                    {{ store.address && store.address.length > 40 ? (store.address | slice:0:40) + '...' : store.address }}
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let store">
                  <mat-slide-toggle 
                    [checked]="store.isActive"
                    (change)="toggleStoreStatus(store)"
                    [matTooltip]="store.isActive ? 'Active' : 'Inactive'">
                  </mat-slide-toggle>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let store">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="openEditStoreModal(store)" 
                            matTooltip="Edit store">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" 
                            (click)="viewStoreDetails(store)" 
                            matTooltip="View details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" 
                            (click)="deleteStore(store)" 
                            matTooltip="Delete store">
                      <mat-icon>delete</mat-icon>
                    </button>
                    <button mat-icon-button color="primary" 
                            (click)="manageUsers(store)" 
                            matTooltip="Manage users">
                      <mat-icon>people</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
  /* Search Container Styles */
  .search-container {
    width: 300px;
  }

  .input-group {
    height: 32px;
  }

  .search-input {
    height: 32px !important;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    padding: 0 12px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .search-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }

  .input-group-text {
    height: 32px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-left: none;
    border-radius: 0 4px 4px 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #6c757d;
  }

  .input-group-text mat-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

    .title-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .title-container mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #667eea;
    }
        
    .store-management-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 2.5rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .page-title mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #667eea;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
    }

    /* Statistics Cards */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon.total {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .stat-icon.active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .stat-icon.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .stat-details {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      margin-top: 4px;
    }

    /* Loading Indicator */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      gap: 16px;
    }

    .loading-container p {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    /* Form Styles */
    .form-card {
      margin-bottom: 32px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .store-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .cancel-btn {
      color: #666;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    /* Table Styles */
    .table-card {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-left: auto;
    }

    .search-field {
      width: 300px;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 120px;
      border-radius: 4px;
      border: none;
      height: 40px;
    }

    .add-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .table-container {
      overflow-x: auto;
      margin: 16px 0;
    }

    .stores-table {
      width: 100%;
      min-width: 800px;
    }

    /* Table Cell Vertical Alignment */
    .stores-table td {
      vertical-align: middle !important;
    }

    .stores-table th {
      vertical-align: middle !important;
    }

    .email-cell,
    .phone-cell,
    .address-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .email-icon {
      color: #1976d2;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .phone-icon {
      color: #2e7d32;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .location-icon {
      color: #f57c00;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .email-link,
    .phone-link {
      color: inherit;
      text-decoration: none;
    }

    .email-link:hover,
    .phone-link:hover {
      text-decoration: underline;
    }

    .store-key-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-family: monospace;
      letter-spacing: 1px;
    }

    .store-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .store-icon {
      color: #667eea;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .address-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .phone-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #667eea;
      text-decoration: none;
    }

    .phone-link:hover {
      text-decoration: underline;
    }

    .users-info mat-chip-set {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .maker-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .checker-chip {
      background-color: #e3f2fd;
      color: #1565c0;
      border: 1px solid #bbdefb;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      min-height: 32px;
    }

    .action-buttons button[color="primary"] mat-icon {
      color: #1976d2 !important;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .action-buttons button[color="accent"] mat-icon {
      color: #ff4081 !important;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .store-management-container {
        padding: 16px;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-container {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        width: 100%;
      }
    }

    /* Animation */
    .form-card, .table-card {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Loading spinner in button */
    .submit-btn mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class StoreManagementComponent implements OnInit, AfterViewInit {
  private readonly storeService = inject(StoreApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['storeKey', 'name', 'email', 'phone', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<Store>([]);
  
  // Signals for reactive state management
  stores = signal<Store[]>([]);
  isLoading = signal<boolean>(false);
  selectedStore = signal<Store | null>(null);
  
  // Computed signals
  storesCount = computed(() => this.stores().length);
  activeStoresCount = computed(() => this.stores().filter(store => store.isActive).length);
  inactiveStoresCount = computed(() => this.stores().filter(store => !store.isActive).length);

  ngOnInit(): void {
    this.loadStores();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStores(): void {
    this.isLoading.set(true);
    this.storeService.getStores().subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        if (response.success && response.stores) {
          this.stores.set(response.stores);
          this.dataSource.data = response.stores;
        }
      },
      error: (error: any) => {
        this.isLoading.set(false);
        console.error('Error loading stores:', error);
        this.snackBar.open('❌ Failed to load stores. Please refresh the page.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openCreateStoreModal(): void {
    const dialogRef = this.dialog.open(CreateStoreModalComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Store was created successfully
        this.loadStores();
      }
    });
  }

  openEditStoreModal(store: Store): void {
    const dialogRef = this.dialog.open(EditStoreModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { store }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStores();
      }
    });
  }

  toggleStoreStatus(store: Store): void {
    this.storeService.toggleStoreStatus(store.id!).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open(`✅ ${response.message}`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadStores();
        } else {
          this.snackBar.open(`❌ ${response.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error: any) => {
        console.error('Error updating store status:', error);
        this.snackBar.open('❌ Failed to update store status. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteStore(store: Store): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Store',
        message: `Are you sure you want to delete "${store.name}"? This action cannot be undone.`,
        confirmText: 'Delete Store',
        cancelText: 'Cancel',
        type: 'delete',
        icon: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storeService.deleteStore(store.id!).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.snackBar.open(`✅ ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['success-snackbar']
              });
              this.loadStores();
            } else {
              this.snackBar.open(`❌ ${response.message}`, 'Close', {
                duration: 4000,
                panelClass: ['error-snackbar']
              });
            }
          },
          error: (error: any) => {
            console.error('Error deleting store:', error);
            this.snackBar.open('❌ Failed to delete store. Please try again.', 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  viewStoreDetails(store: Store): void {
    const dialogRef = this.dialog.open(StoreDetailsModalComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { store }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Modal closed, no action needed
    });
  }

  manageUsers(store: Store): void {
    const dialogRef = this.dialog.open(ManageUsersModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { store }
    });

    dialogRef.afterClosed().subscribe(result => {
      // No need to reload stores as user management doesn't affect store list
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
