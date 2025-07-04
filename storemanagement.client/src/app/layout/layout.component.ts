import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, filter } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { ThemeSelectorComponent } from '../components/theme-selector.component';

export interface NavigationItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavigationItem[];
  permission?: string;
  badge?: number;
  divider?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    ThemeSelectorComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container" autosize>
      <!-- Sidebar -->
      <mat-sidenav 
        #drawer 
        class="sidenav" 
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false">
        
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="logo-container">
            <mat-icon class="logo-icon">store</mat-icon>
            <span class="logo-text">Store Management</span>
          </div>
          <div class="user-info" *ngIf="currentUser$ | async as user">
            <div class="user-avatar">
              <img [src]="user.avatar" [alt]="user.firstName + ' ' + user.lastName" />
            </div>
            <div class="user-details">
              <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
              <div class="user-role">{{ user.role | titlecase }}</div>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <mat-nav-list class="nav-list">
          <ng-container *ngFor="let item of navigationItems">
            
            <!-- Divider -->
            <mat-divider *ngIf="item.divider"></mat-divider>
            
            <!-- Menu Item with Children -->
            <div *ngIf="item.children && item.children.length > 0" class="nav-group">
              <div class="nav-group-header">
                <mat-icon>{{ item.icon }}</mat-icon>
                <span>{{ item.label }}</span>
              </div>
              <div class="nav-group-items">
                <a mat-list-item 
                   *ngFor="let child of item.children"
                   [routerLink]="child.route"
                   routerLinkActive="active"
                   [matTooltip]="child.label"
                   matTooltipPosition="right">
                  <mat-icon matListItemIcon>{{ child.icon }}</mat-icon>
                  <span matListItemTitle>{{ child.label }}</span>
                  <span matListItemLine *ngIf="child.badge" 
                        class="badge"
                        [matBadge]="child.badge" 
                        matBadgeColor="warn" 
                        matBadgeSize="small">
                  </span>
                </a>
              </div>
            </div>

            <!-- Simple Menu Item -->
            <a mat-list-item 
               *ngIf="!item.children || item.children.length === 0"
               [routerLink]="item.route"
               routerLinkActive="active"
               [matTooltip]="item.label"
               matTooltipPosition="right">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              <span matListItemLine *ngIf="item.badge" 
                    class="badge"
                    [matBadge]="item.badge" 
                    matBadgeColor="warn" 
                    matBadgeSize="small">
              </span>
            </a>
          </ng-container>
        </mat-nav-list>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <button mat-stroked-button color="warn" (click)="logout()" class="logout-btn">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content>
        <!-- Top Toolbar -->
        <mat-toolbar color="primary" class="toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span class="toolbar-title">{{ currentPageTitle }}</span>
          
          <span class="toolbar-spacer"></span>
          
          <!-- Theme Selector -->
          <app-theme-selector></app-theme-selector>
          
          <!-- User Menu -->
          <button mat-icon-button [matMenuTriggerFor]="userMenu" *ngIf="currentUser$ | async as user">
            <img [src]="user.avatar" [alt]="user.firstName" class="user-avatar-small" />
          </button>
          
          <mat-menu #userMenu="matMenu">
            <div class="user-menu-header" *ngIf="currentUser$ | async as user">
              <div class="user-menu-info">
                <div class="user-menu-name">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="user-menu-email">{{ user.email }}</div>
              </div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="goToProfile()">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item (click)="goToSettings()">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
          
          <!-- Notifications -->
          <button mat-icon-button matTooltip="Notifications">
            <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
          </button>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  currentPageTitle = 'Dashboard';
  readonly currentUser$ = this.authService.currentUser$;

  readonly isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Inventory',
      icon: 'inventory',
      children: [
        { label: 'Products', icon: 'shopping_cart', route: '/products' },
        { label: 'Categories', icon: 'category', route: '/categories' }
      ]
    },
    {
      label: 'Store Management',
      icon: 'store',
      children: [
        { label: 'Stores', icon: 'shopping_cart', route: '/stores' }
      ]
    },
    {
      label: 'Help & Support',
      icon: 'help',
      route: '/help'
    },
  ];

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updatePageTitle((event as NavigationEnd).url);
      });
  }

  private updatePageTitle(url: string): void {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/home': 'Home',
      '/products': 'Products',
      '/categories': 'Categories',
      '/store-management': 'Store Management'
    };

    this.currentPageTitle = titles[url] || 'Store Management';
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
