import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'selected-theme';

  private themes: Theme[] = [
    {
      id: 'light-blue',
      name: 'light-blue',
      displayName: 'Light Blue',
      icon: 'wb_sunny',
      colors: {
        primary: '#e3f2fd',
        primaryDark: '#bbdefb',
        secondary: '#f3e5f5',
        accent: '#fff3e0',
        background: '#fafafa',
        surface: '#ffffff',
        textPrimary: '#37474f',
        textSecondary: '#78909c',
        border: '#e3f2fd'
      }
    },
    {
      id: 'dark-purple',
      name: 'dark-purple',
      displayName: 'Dark Purple',
      icon: 'nights_stay',
      colors: {
        primary: '#673ab7',
        primaryDark: '#512da8',
        secondary: '#9c27b0',
        accent: '#ff5722',
        background: '#303030',
        surface: '#424242',
        textPrimary: '#ffffff',
        textSecondary: '#e0e0e0',
        border: '#616161'
      }
    },
    {
      id: 'green-nature',
      name: 'green-nature',
      displayName: 'Green Nature',
      icon: 'eco',
      colors: {
        primary: '#e8f5e8',
        primaryDark: '#c8e6c9',
        secondary: '#f1f8e9',
        accent: '#fff3e0',
        background: '#f9fbe7',
        surface: '#ffffff',
        textPrimary: '#2e7d32',
        textSecondary: '#558b2f',
        border: '#c8e6c9'
      }
    },
    {
      id: 'ocean-breeze',
      name: 'ocean-breeze',
      displayName: 'Ocean Breeze',
      icon: 'waves',
      colors: {
        primary: '#e0f2f1',
        primaryDark: '#b2dfdb',
        secondary: '#e0f7fa',
        accent: '#fff8e1',
        background: '#f3fdfd',
        surface: '#ffffff',
        textPrimary: '#00695c',
        textSecondary: '#00838f',
        border: '#b2dfdb'
      }
    },
    {
      id: 'sunset-orange',
      name: 'sunset-orange',
      displayName: 'Sunset Orange',
      icon: 'wb_twilight',
      colors: {
        primary: '#fff3e0',
        primaryDark: '#ffcc02',
        secondary: '#fce4ec',
        accent: '#f3e5f5',
        background: '#fffbf7',
        surface: '#ffffff',
        textPrimary: '#e65100',
        textSecondary: '#f57c00',
        border: '#ffcc02'
      }
    },
    {
      id: 'midnight-dark',
      name: 'midnight-dark',
      displayName: 'Midnight Dark',
      icon: 'bedtime',
      colors: {
        primary: '#1a237e',
        primaryDark: '#0d47a1',
        secondary: '#283593',
        accent: '#3f51b5',
        background: '#121212',
        surface: '#1e1e1e',
        textPrimary: '#ffffff',
        textSecondary: '#b0bec5',
        border: '#37474f'
      }
    }
  ];

  private currentThemeSubject = new BehaviorSubject<Theme>(this.themes[0]); // Default to first theme
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.loadSavedTheme();
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.applyTheme(theme);
      this.saveTheme(themeId);
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--background-color', theme.colors.background);
    root.style.setProperty('--surface-color', theme.colors.surface);
    root.style.setProperty('--text-primary', theme.colors.textPrimary);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--border-color', theme.colors.border);

    // Remove existing theme classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme.name}`);
  }

  private saveTheme(themeId: string): void {
    localStorage.setItem(this.THEME_STORAGE_KEY, themeId);
  }

  private loadSavedTheme(): void {
    const savedThemeId = localStorage.getItem(this.THEME_STORAGE_KEY);
    if (savedThemeId) {
      this.setTheme(savedThemeId);
    } else {
      this.setTheme('light-blue'); // Default theme
    }
  }
}
