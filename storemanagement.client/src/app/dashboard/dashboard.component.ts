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
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section" *ngIf="currentUser$ | async as user">
        <h1>Welcome back, {{ user.firstName }}!</h1>
        <p>Here's what's happening in your store today.</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>Today's Sales</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">$2,847.50</div>
            <div class="stat-change positive">+12.5% from yesterday</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>shopping_cart</mat-icon>
            <mat-card-title>Orders</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">24</div>
            <div class="stat-change positive">+3 from yesterday</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>inventory</mat-icon>
            <mat-card-title>Low Stock Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">5</div>
            <div class="stat-change negative">Needs attention</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>New Customers</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">8</div>
            <div class="stat-change positive">+2 from yesterday</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="action-grid">
        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary">
                <mat-icon>add_shopping_cart</mat-icon>
                New Sale
              </button>
              <button mat-raised-button color="accent">
                <mat-icon>inventory_2</mat-icon>
                Add Product
              </button>
              <button mat-raised-button>
                <mat-icon>person_add</mat-icon>
                New Customer
              </button>
              <button mat-raised-button>
                <mat-icon>assessment</mat-icon>
                View Reports
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <mat-icon>shopping_cart</mat-icon>
                <div class="activity-content">
                  <div class="activity-title">Order #1234 completed</div>
                  <div class="activity-time">2 minutes ago</div>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon>inventory</mat-icon>
                <div class="activity-content">
                  <div class="activity-title">Product "Coffee Beans" restocked</div>
                  <div class="activity-time">15 minutes ago</div>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon>person_add</mat-icon>
                <div class="activity-content">
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
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .welcome-section {
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .welcome-section h1 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: white;
    }

    .welcome-section p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      text-align: center;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid #e0e0e0;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-card mat-icon[mat-card-avatar] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 600;
      color: #333;
      margin: 16px 0 8px 0;
    }

    .stat-change {
      font-size: 0.9rem;
      font-weight: 500;
    }

    .stat-change.positive {
      color: #28a745;
    }

    .stat-change.negative {
      color: #dc3545;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .action-card {
      height: fit-content;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .action-buttons button[color="primary"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
    }

    .action-buttons button[color="accent"] {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: none;
      color: white;
    }

    .action-buttons button:not([color]) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border: none;
      color: white;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }

    .activity-item:hover {
      background-color: #f8f9fa;
      padding-left: 8px;
      padding-right: 8px;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item mat-icon {
      color: #667eea;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .activity-time {
      font-size: 0.8rem;
      color: #999;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .action-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }

      .welcome-section {
        padding: 16px;
      }

      .welcome-section h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  readonly currentUser$ = this.authService.currentUser$;
}
