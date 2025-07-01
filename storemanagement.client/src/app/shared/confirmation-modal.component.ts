import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'delete' | 'warning' | 'info' | 'maker' | 'checker';
  icon?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirmation-modal" [ngClass]="data.type || 'delete'">
      <div class="modal-header">
        <div class="header-content">
          <mat-icon class="modal-icon" [ngClass]="data.type || 'delete'">
            {{ data.icon || getDefaultIcon() }}
          </mat-icon>
          <h3 mat-dialog-title>{{ data.title }}</h3>
        </div>
      </div>

      <mat-dialog-content class="modal-content">
        <p class="message">{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="modal-actions">
        <button mat-button 
                mat-dialog-close="false" 
                class="cancel-btn">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button 
                [color]="getButtonColor()"
                [ngClass]="getButtonColor()"
                (click)="confirm()" 
                class="confirm-btn">
          <mat-icon>{{ getConfirmIcon() }}</mat-icon>
          {{ data.confirmText || getDefaultConfirmText() }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-modal {
      min-width: 400px;
      max-width: 500px;
    }

    .modal-header {
      padding: 24px 24px 16px 24px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .modal-icon {
      font-size: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-icon.delete {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .modal-icon.warning {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .modal-icon.info {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .modal-icon.maker {
      background-color: #e8f5e8;
      color: #4caf50;
    }

    .modal-icon.checker {
      background-color: #e3f2fd;
      color: #2196f3;
    }

    .modal-header h3 {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    .modal-content {
      padding: 0 24px 16px 24px;
    }

    .message {
      font-size: 1rem;
      line-height: 1.5;
      color: #555;
      margin: 0;
      padding-left: 56px; /* Align with title after icon */
    }

    .modal-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      border-top: 1px solid #e0e0e0;
      background-color: #fafafa;
    }

    .cancel-btn {
      color: #666;
      min-width: 100px;
      height: 36px;
    }

    .confirm-btn {
      min-width: 120px;
      height: 36px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .confirm-btn.mat-warn {
      background-color: #d32f2f;
      color: white;
    }

    .confirm-btn.mat-primary {
      background-color: #1976d2;
      color: white;
    }

    .confirm-btn.mat-accent {
      background-color: #f57c00;
      color: white;
    }

    .confirm-btn.maker {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
      color: white !important;
      border: none !important;
    }

    .confirm-btn.maker:hover {
      background: linear-gradient(135deg, #43a047 0%, #5cb85c 100%) !important;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      transform: translateY(-1px);
    }

    .confirm-btn.checker {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%) !important;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
      color: white !important;
      border: none !important;
    }

    .confirm-btn.checker:hover {
      background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%) !important;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
      transform: translateY(-1px);
    }

    /* Animation */
    .confirmation-modal {
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .confirmation-modal {
        min-width: 300px;
      }

      .modal-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      .message {
        padding-left: 48px;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .cancel-btn,
      .confirm-btn {
        width: 100%;
      }
    }
  `]
})
export class ConfirmationModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationModalComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationModalData) {}

  getDefaultIcon(): string {
    switch (this.data.type) {
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'maker': return 'person_add';
      case 'checker': return 'person_add';
      case 'delete':
      default: return 'delete';
    }
  }

  getDefaultConfirmText(): string {
    switch (this.data.type) {
      case 'warning': return 'Proceed';
      case 'info': return 'OK';
      case 'maker': return 'Create Maker';
      case 'checker': return 'Create Checker';
      case 'delete':
      default: return 'Delete';
    }
  }

  getConfirmIcon(): string {
    switch (this.data.type) {
      case 'warning': return 'warning';
      case 'info': return 'check';
      case 'maker': return 'person_add';
      case 'checker': return 'person_add';
      case 'delete':
      default: return 'delete';
    }
  }

  getButtonColor(): string {
    switch (this.data.type) {
      case 'warning': return 'accent';
      case 'info': return 'primary';
      case 'maker': return 'maker';
      case 'checker': return 'checker';
      case 'delete':
      default: return 'warn';
    }
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
