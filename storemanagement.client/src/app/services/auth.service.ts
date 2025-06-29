import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatar: string;
    permissions: string[];
    department: string;
  };
  expiresIn: number;
  refreshToken: string;
  message: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  permissions: string[];
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  private readonly apiUrl = '/api/auth'; // Update with your actual API URL
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  
  // Subject to track authentication state
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());

  // Public observables
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
        .pipe(
          tap(authResponse => {
            this.storeAuthData(authResponse);
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(authResponse.user);
          }),
          catchError(this.handleAuthError)
        )
        .toPromise();

      if (!response) {
        throw new Error('Login failed: No response received');
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Mock login using JSON data for development/testing
   */
  async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Load mock data from JSON file
      const response = await firstValueFrom(this.http.get<any>('/assets/mock-data/auth-data.json'));
      
      if (!response) {
        throw new Error('Failed to load authentication data');
      }

      // Find user in mock data
      const user = response.users.find((u: any) => 
        u.username === credentials.username && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid credentials. Try: admin/admin, manager/manager123, or cashier/cashier123');
      }

      if (!user.isActive) {
        throw new Error('Account has been disabled. Please contact administrator.');
      }

      // Get the corresponding login response
      const loginResponse = response.loginResponses[credentials.username];
      
      if (!loginResponse) {
        throw new Error('Login configuration not found for user');
      }

      // Update last login time
      user.lastLogin = new Date().toISOString();

      // Create auth response
      const authResponse: AuthResponse = {
        success: true,
        token: `${loginResponse.token}-${Date.now()}`, // Make token unique
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          permissions: user.permissions,
          department: user.department
        },
        expiresIn: loginResponse.expiresIn,
        refreshToken: loginResponse.refreshToken,
        message: loginResponse.message
      };

      this.storeAuthData(authResponse, credentials.rememberMe);
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(authResponse.user);

      return authResponse;
    } catch (error) {
      console.error('Mock login error:', error);
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  /**
   * Logout user and clear stored data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      // await this.http.post(`${this.apiUrl}/logout`, {}).toPromise();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      await this.router.navigate(['/login']);
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get current user information
   */
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, {})
        .pipe(catchError(this.handleAuthError))
        .toPromise();

      if (response?.token) {
        this.storeToken(response.token);
        return response.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  /**
   * Store authentication data
   */
  private storeAuthData(authResponse: AuthResponse, rememberMe: boolean = false): void {
    // Use localStorage if rememberMe is true, otherwise use sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(this.tokenKey, authResponse.token);
    storage.setItem(this.userKey, JSON.stringify(authResponse.user));
    storage.setItem(`${this.tokenKey}_refresh`, authResponse.refreshToken);
    
    // Set token expiration
    const expirationTime = Date.now() + (authResponse.expiresIn * 1000);
    storage.setItem(`${this.tokenKey}_expiry`, expirationTime.toString());
  }

  /**
   * Store just the token (for refresh scenarios)
   */
  private storeToken(token: string): void {
    const currentStorage = localStorage.getItem(this.tokenKey) ? localStorage : sessionStorage;
    currentStorage.setItem(this.tokenKey, token);
  }

  /**
   * Clear all stored authentication data
   */
  private clearAuthData(): void {
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(this.tokenKey);
      storage.removeItem(this.userKey);
      storage.removeItem(`${this.tokenKey}_expiry`);
      storage.removeItem(`${this.tokenKey}_refresh`);
    });
  }

  /**
   * Check if stored token is valid and not expired
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expirationTime = localStorage.getItem(`${this.tokenKey}_expiry`) || 
                          sessionStorage.getItem(`${this.tokenKey}_expiry`);
    
    if (!expirationTime) return false;

    return Date.now() < parseInt(expirationTime);
  }

  /**
   * Check token validity and logout if expired
   */
  private checkTokenValidity(): void {
    if (this.getToken() && !this.hasValidToken()) {
      this.logout();
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Authentication failed';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 429:
          errorMessage = 'Too many login attempts. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || 'Login failed';
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
