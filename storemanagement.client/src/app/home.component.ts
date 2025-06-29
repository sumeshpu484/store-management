import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container-fluid" style="padding: 20px;">
      <div class="row">
        <div class="col-12">
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                <mat-icon>home</mat-icon>
                Welcome to Store Management
              </mat-card-title>
              <mat-card-subtitle *ngIf="currentUser$ | async as user">
                Hello, {{ user.firstName }} {{ user.lastName }}! ({{ user.username }})
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>Angular 20 with Bootstrap and Material Design is working!</p>
              
              <div class="alert alert-success" role="alert" *ngIf="authService.isAuthenticated()">
                <mat-icon>check_circle</mat-icon>
                You are successfully authenticated!
              </div>
              
              <div class="alert alert-info" role="alert">
                <mat-icon>info</mat-icon>
                Bootstrap and Angular Material are working together!
              </div>

              <div *ngIf="currentUser$ | async as user" class="user-info mt-3">
                <h5>User Information:</h5>
                <div class="row">
                  <div class="col-md-4">
                    <img [src]="user.avatar" [alt]="user.firstName + ' ' + user.lastName" 
                         class="img-thumbnail mb-3" style="width: 100px; height: 100px;">
                  </div>
                  <div class="col-md-8">
                    <ul class="list-group">
                      <li class="list-group-item"><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</li>
                      <li class="list-group-item"><strong>Username:</strong> {{ user.username }}</li>
                      <li class="list-group-item"><strong>Email:</strong> {{ user.email }}</li>
                      <li class="list-group-item"><strong>Role:</strong> {{ user.role | titlecase }}</li>
                      <li class="list-group-item"><strong>Department:</strong> {{ user.department }}</li>
                    </ul>
                  </div>
                </div>
                
                <div class="permissions mt-3" *ngIf="user.permissions && user.permissions.length > 0">
                  <h6>Permissions:</h6>
                  <div class="d-flex flex-wrap gap-1">
                    <span *ngFor="let permission of user.permissions" 
                          class="badge bg-secondary me-1 mb-1">{{ permission }}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-raised-button color="primary" (click)="goToLogin()" *ngIf="!authService.isAuthenticated()">
                <mat-icon>login</mat-icon>
                Go to Login
              </button>
              
              <button mat-raised-button color="warn" (click)="logout()" *ngIf="authService.isAuthenticated()">
                <mat-icon>logout</mat-icon>
                Logout
              </button>
              
              <button mat-raised-button color="accent" (click)="goToTest()">
                <mat-icon>science</mat-icon>
                Test Page
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-info {
      margin-top: 1rem;
    }
    
    mat-card-header mat-icon {
      margin-right: 8px;
    }
    
    .alert mat-icon {
      margin-right: 8px;
      vertical-align: middle;
    }
    
    mat-card-actions button {
      margin-right: 8px;
    }
  `]
})
export class HomeComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  readonly currentUser$ = this.authService.currentUser$;

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToTest(): void {
    this.router.navigate(['/test']);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
