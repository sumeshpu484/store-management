import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="themeMenu"
      matTooltip="Switch Theme"
      class="theme-button">
      <mat-icon>{{ currentTheme.icon }}</mat-icon>
    </button>

    <mat-menu #themeMenu="matMenu" class="theme-menu">
      <div class="theme-menu-header">
        <mat-icon>palette</mat-icon>
        <span>Choose Theme</span>
      </div>
      
      <button 
        mat-menu-item 
        *ngFor="let theme of themes"
        (click)="selectTheme(theme.id)"
        [class.active]="theme.id === currentTheme.id"
        class="theme-menu-item">
        <mat-icon [style.color]="getThemeIconColor(theme)">{{ theme.icon }}</mat-icon>
        <span>{{ theme.displayName }}</span>
        <mat-icon *ngIf="theme.id === currentTheme.id" class="check-icon">check</mat-icon>
      </button>
    </mat-menu>
  `,
  styles: [`
    .theme-button {
      transition: all 0.3s ease;
    }

    .theme-button:hover {
      transform: scale(1.1);
    }

    .theme-menu {
      min-width: 220px;
    }

    .theme-menu-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background: var(--primary-color);
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-color);
      font-weight: 600;
      font-size: 14px;
      
      mat-icon {
        margin-right: 8px;
        color: var(--text-primary);
      }
    }

    .theme-menu-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      position: relative;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--primary-color);
        transform: translateX(4px);
      }
      
      &.active {
        background-color: var(--primary-color);
        color: var(--text-primary);
        font-weight: 500;
      }
      
      mat-icon {
        margin-right: 12px;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      
      span {
        flex: 1;
      }
      
      .check-icon {
        color: #4caf50;
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-left: 8px;
        margin-right: 0;
      }
    }

    // Theme-specific icon colors
    .theme-light-blue .theme-menu-item mat-icon {
      &.wb_sunny { color: #2196f3; }
    }
    
    .theme-dark-purple .theme-menu-item mat-icon {
      &.nights_stay { color: #673ab7; }
    }
    
    .theme-green-nature .theme-menu-item mat-icon {
      &.eco { color: #4caf50; }
    }
    
    .theme-ocean-breeze .theme-menu-item mat-icon {
      &.waves { color: #00bcd4; }
    }
    
    .theme-sunset-orange .theme-menu-item mat-icon {
      &.wb_twilight { color: #ff9800; }
    }
    
    .theme-midnight-dark .theme-menu-item mat-icon {
      &.bedtime { color: #3f51b5; }
    }
  `]
})
export class ThemeSelectorComponent {
  private readonly themeService = inject(ThemeService);
  
  themes = this.themeService.getThemes();
  currentTheme: Theme = this.themeService.getCurrentTheme();

  constructor() {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  getThemeIconColor(theme: Theme): string {
    const colors: { [key: string]: string } = {
      'light-blue': '#2196f3',
      'dark-purple': '#673ab7',
      'green-nature': '#4caf50',
      'ocean-breeze': '#00bcd4',
      'sunset-orange': '#ff9800',
      'midnight-dark': '#3f51b5'
    };
    return colors[theme.id] || '#666';
  }
}
