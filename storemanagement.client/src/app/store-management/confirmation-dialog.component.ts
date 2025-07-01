import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn' | 'maker' | 'checker';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header">
        <mat-icon [ngClass]="getIconClass()" *ngIf="data.icon">
          {{ data.icon }}
        </mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-button mat-dialog-close="false" class="cancel-btn">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button 
                [ngClass]="getConfirmButtonClass()"
                mat-dialog-close="true"
                class="confirm-btn">
          <mat-icon *ngIf="data.icon">{{ data.icon }}</mat-icon>
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      min-width: 400px;
      max-width: 500px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .dialog-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .dialog-header mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .icon-primary {
      color: #1976d2;
    }

    .icon-accent {
      color: #ff4081;
    }

    .icon-warn {
      color: #f44336;
    }

    .icon-maker {
      color: #4caf50;
    }

    .icon-checker {
      color: #2196f3;
    }

    .dialog-content {
      margin-bottom: 24px;
    }

    .dialog-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .cancel-btn {
      color: #666;
    }

    .confirm-btn {
      min-width: 140px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: white !important;
      border: none;
      font-weight: 500;
    }

    .confirm-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .confirm-maker-btn {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    .confirm-maker-btn:hover {
      background: linear-gradient(135deg, #43a047 0%, #5cb85c 100%) !important;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      transform: translateY(-1px);
    }

    .confirm-checker-btn {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%) !important;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
    }

    .confirm-checker-btn:hover {
      background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%) !important;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
      transform: translateY(-1px);
    }

    .confirm-primary-btn {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .confirm-accent-btn {
      background: linear-gradient(135deg, #ff4081 0%, #f8bbd9 100%) !important;
      box-shadow: 0 2px 8px rgba(255, 64, 129, 0.3);
    }

    .confirm-warn-btn {
      background: linear-gradient(135deg, #f44336 0%, #ef5350 100%) !important;
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
    }

    .confirm-btn .mat-mdc-button-touch-target {
      background: transparent !important;
    }
  `]
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationData) {}

  getIconClass(): string {
    return `icon-${this.data.color || 'primary'}`;
  }

  getConfirmButtonClass(): string {
    return `confirm-${this.data.color || 'primary'}-btn`;
  }
}