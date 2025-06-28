import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-6">
          <mat-card class="mb-3">
            <mat-card-header>
              <mat-card-title>Angular Material Test</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>This card uses Angular Material components</p>
              <button mat-raised-button color="primary">
                <mat-icon>thumb_up</mat-icon>
                Material Button
              </button>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Bootstrap Test</h5>
            </div>
            <div class="card-body">
              <p class="card-text">This card uses Bootstrap classes</p>
              <button type="button" class="btn btn-success">
                Bootstrap Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class TestComponent { }
