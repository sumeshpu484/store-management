import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p *ngIf="currentUser$ | async as user">Welcome back, {{ user.firstName }}!</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <mat-card>
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>inventory</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">1,234</div>
                  <div class="stat-label">Total Products</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="stat-card">
          <mat-card>
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>receipt_long</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">89</div>
                  <div class="stat-label">Pending Orders</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="stat-card">
          <mat-card>
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">$12,543</div>
                  <div class="stat-label">Today's Sales</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="stat-card">
          <mat-card>
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">567</div>
                  <div class="stat-label">Customers</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="actions-grid">
              <button mat-raised-button color="primary" class="action-button">
                <mat-icon>add_shopping_cart</mat-icon>
                New Sale
              </button>
              <button mat-raised-button color="accent" class="action-button">
                <mat-icon>add_box</mat-icon>
                Add Product
              </button>
              <button mat-raised-button class="action-button">
                <mat-icon>person_add</mat-icon>
                Add Customer
              </button>
              <button mat-raised-button class="action-button">
                <mat-icon>assessment</mat-icon>
                View Reports
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <mat-icon>shopping_cart</mat-icon>
                <div class="activity-details">
                  <div class="activity-title">New order #1234 received</div>
                  <div class="activity-time">2 minutes ago</div>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon>inventory_2</mat-icon>
                <div class="activity-details">
                  <div class="activity-title">Stock updated for iPhone 15</div>
                  <div class="activity-time">15 minutes ago</div>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon>person_add</mat-icon>
                <div class="activity-details">
                  <div class="activity-title">New customer registered</div>
                  <div class="activity-time">1 hour ago</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 24px;
    }

    .dashboard-header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 500;
    }

    .dashboard-header p {
      margin: 0;
      color: #666;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      .mat-mdc-card {
        padding: 0;
      }
    }

    .stat-content {
      display: flex;
      align-items: center;
      padding: 16px;
    }

    .stat-icon {
      background: #673ab7;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;

      mat-icon {
        color: white;
        font-size: 24px;
      }
    }

    .stat-info {
      .stat-number {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        line-height: 1;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }
    }

    .quick-actions {
      margin-bottom: 24px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .action-button {
      height: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .recent-activity {
      margin-bottom: 24px;
    }

    .activity-list {
      .activity-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        mat-icon {
          margin-right: 16px;
          color: #673ab7;
        }

        .activity-details {
          .activity-title {
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }

          .activity-time {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  readonly currentUser$ = this.authService.currentUser$;
}
