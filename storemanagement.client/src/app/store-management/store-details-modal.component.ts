import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '../models/store.interface';

@Component({
  selector: 'app-store-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>
        <mat-icon>store</mat-icon>
        Store Details
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modal-content">
      <div class="store-details-container">
        <!-- Store Header -->
        <div class="store-header">
          <div class="store-title">
            <h3>{{ store.name }}</h3>
            <mat-chip 
              [class]="store.isActive ? 'active-chip' : 'inactive-chip'"
              [matTooltip]="store.isActive ? 'Store is active' : 'Store is inactive'">
              {{ store.isActive ? 'Active' : 'Inactive' }}
            </mat-chip>
          </div>
          <div class="store-key-section">
            <mat-chip class="store-key-chip">{{ store.storeKey }}</mat-chip>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Store Information -->
        <div class="details-section">
          <h4>
            <mat-icon>info</mat-icon>
            Basic Information
          </h4>
          
          <div class="info-grid">
            <div class="info-item">
              <mat-icon class="info-icon location-icon">location_on</mat-icon>
              <div class="info-content">
                <label>Address</label>
                <p>{{ store.address }}</p>
              </div>
            </div>

            <div class="info-item">
              <mat-icon class="info-icon email-icon">email</mat-icon>
              <div class="info-content">
                <label>Email</label>
                <p>{{ store.email }}</p>
              </div>
            </div>

            <div class="info-item">
              <mat-icon class="info-icon phone-icon">phone</mat-icon>
              <div class="info-content">
                <label>Phone Number</label>
                <p>{{ store.phone }}</p>
              </div>
            </div>

            <div class="info-item">
              <mat-icon class="info-icon date-icon">date_range</mat-icon>
              <div class="info-content">
                <label>Created Date</label>
                <p>{{ store.createdDate | date:'medium' }}</p>
              </div>
            </div>

            <div class="info-item" *ngIf="store.updatedDate">
              <mat-icon class="info-icon update-icon">update</mat-icon>
              <div class="info-content">
                <label>Last Updated</label>
                <p>{{ store.updatedDate | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Store Statistics -->
        <div class="stats-section">
          <h4>
            <mat-icon>analytics</mat-icon>
            Store Statistics
          </h4>
          
          <div class="stats-grid">
            <div class="stat-card">
              <mat-icon class="stat-icon">key</mat-icon>
              <div class="stat-content">
                <span class="stat-value">{{ store.storeKey.length }}</span>
                <span class="stat-label">Key Length</span>
              </div>
            </div>

            <div class="stat-card">
              <mat-icon class="stat-icon">schedule</mat-icon>
              <div class="stat-content">
                <span class="stat-value">{{ getDaysActive() }}</span>
                <span class="stat-label">Days Active</span>
              </div>
            </div>

            <div class="stat-card">
              <mat-icon class="stat-icon">people</mat-icon>
              <div class="stat-content">
                <span class="stat-value">2</span>
                <span class="stat-label">Default Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions class="modal-actions">
      <button mat-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
        Close
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
      padding: 0 24px;
      min-width: 600px;
      max-width: 800px;
      min-height: 400px;
    }

    .store-details-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .store-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .store-title {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .store-title h3 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .store-key-section {
      display: flex;
      align-items: center;
    }

    .store-key-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-family: monospace;
      letter-spacing: 1px;
      font-size: 0.9rem;
    }

    .active-chip {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      color: white;
    }

    .inactive-chip {
      background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
      color: white;
    }

    .details-section h4,
    .stats-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .info-icon {
      margin-top: 2px;
      font-size: 20px;
    }

    .location-icon {
      color: #ff9800;
    }

    .email-icon {
      color: #2196f3;
    }

    .phone-icon {
      color: #4caf50;
    }

    .date-icon {
      color: #9c27b0;
    }

    .update-icon {
      color: #ff5722;
    }

    .info-content {
      flex: 1;
    }

    .info-content label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 4px;
    }

    .info-content p {
      margin: 0;
      color: #333;
      word-break: break-word;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .stat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      margin-bottom: 8px;
      opacity: 0.9;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .stat-label {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .modal-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      justify-content: flex-end;
    }

    .close-btn {
      color: #667eea;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-content {
        min-width: auto;
        padding: 0 16px;
      }

      .store-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }
    }
  `]
})
export class StoreDetailsModalComponent {
  private readonly dialogRef = inject(MatDialogRef<StoreDetailsModalComponent>);

  store: Store;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { store: Store }) {
    this.store = data.store;
  }

  getDaysActive(): number {
    if (!this.store.createdDate) return 0;
    const created = new Date(this.store.createdDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
