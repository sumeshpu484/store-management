import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.interface';
import { CreateStoreModalComponent } from './create-store-modal.component';
import { EditStoreModalComponent } from './edit-store-modal.component';
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
          <div class="table-container">
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

              <!-- Address Column -->
              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Address</th>
                <td mat-cell *matCellDef="let store">
                  <div class="address-cell" [matTooltip]="store.address">
                    {{ store.address.length > 50 ? (store.address | slice:0:50) + '...' : store.address }}
                  </div>
                </td>
              </ng-container>

              <!-- Phone Column -->
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let store">
                  <a href="tel:{{ store.phone }}" class="phone-link">
                    <mat-icon>phone</mat-icon>
                    {{ store.phone }}
                  </a>
                </td>
              </ng-container>

              <!-- Users Column -->
              <ng-container matColumnDef="users">
                <th mat-header-cell *matHeaderCellDef>Default Users</th>
                <td mat-cell *matCellDef="let store">
                  <div class="users-info">
                    <mat-chip-set>
                      <mat-chip class="maker-chip">
                        <mat-icon matChipAvatar>person</mat-icon>
                        {{ store.makerUsername }}
                      </mat-chip>
                      <mat-chip class="checker-chip">
                        <mat-icon matChipAvatar>verified_user</mat-icon>
                        {{ store.checkerUsername }}
                      </mat-chip>
                    </mat-chip-set>
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
                            matTooltip="Edit store & manage users">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" 
                            (click)="openEditStoreModal(store, 1)" 
                            matTooltip="Manage users">
                      <mat-icon>group</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" 
                            (click)="deleteStore(store)" 
                            matTooltip="Delete store">
                      <mat-icon>delete</mat-icon>
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
    }

    .table-container {
      overflow-x: auto;
      margin: 16px 0;
    }

    .stores-table {
      width: 100%;
      min-width: 800px;
    }

    .store-key-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }

    .store-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .store-icon {
      color: #667eea;
      font-size: 18px;
    }

    .address-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    }

    /* Responsive */
    @media (max-width: 768px) {
      .store-management-container {
        padding: 16px;
      }

      .page-title {
        font-size: 2rem;
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
  private readonly storeService = inject(StoreService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['storeKey', 'name', 'address', 'phone', 'users', 'status', 'actions'];
  dataSource = new MatTableDataSource<Store>([]);

  ngOnInit(): void {
    this.loadStores();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response) => {
        if (response.success && response.stores) {
          this.dataSource.data = response.stores;
        }
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        alert('Error loading stores');
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

  openEditStoreModal(store: Store, tabIndex: number = 0): void {
    const dialogRef = this.dialog.open(EditStoreModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { store }
    });

    // Set the selected tab if specified
    if (tabIndex > 0) {
      setTimeout(() => {
        const tabGroup = dialogRef.componentInstance;
        // This would require additional setup to control the tab selection
      }, 0);
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Store was updated successfully
        this.loadStores();
      }
    });
  }

  toggleStoreStatus(store: Store): void {
    this.storeService.toggleStoreStatus(store.id!).subscribe({
      next: (response) => {
        if (response.success) {
          alert(response.message);
          this.loadStores();
        }
      },
      error: (error) => {
        console.error('Error updating store status:', error);
        alert('Error updating store status');
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
          next: (response) => {
            if (response.success) {
              alert(response.message);
              this.loadStores();
            }
          },
          error: (error) => {
            console.error('Error deleting store:', error);
            alert('Error deleting store');
          }
        });
      }
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
