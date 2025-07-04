import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, firstValueFrom, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  
  private readonly apiUrl = environment.authApiUrl; // Use auth API URL from environment
  private readonly useMockData = false; // Set to true for development without backend
  private readonly bypassAuthForDevelopment = false; // Set to true to bypass auth entirely
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly refreshTokenKey = 'refresh_token';
  
  // Subject to track authentication state
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.bypassAuthForDevelopment || this.hasValidToken()
  );
  private readonly currentUserSubject = new BehaviorSubject<User | null>(
    this.bypassAuthForDevelopment ? this.getMockUser() : this.getCurrentUser()
  );

  // Public observables
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  /**
   * Authenticate user with credentials using the .NET Core API
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.useMockData) {
      return this.mockLogin(credentials);
    }

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
          username: credentials.username,
          password: credentials.password,
          rememberMe: credentials.rememberMe
        }).pipe(
          catchError(this.handleAuthError)
        )
      );

      if (!response || !response.success) {
        throw new Error(response?.message || 'Login failed');
      }

      // Store authentication data
      this.storeAuthData(response, credentials.rememberMe);
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(response.user);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhanced error handling
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          throw new Error(error.error?.message || 'Invalid credentials');
        } else if (error.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (error.status === 0) {
          throw new Error('Unable to connect to server. Please check your connection.');
        }
      }
      
      throw error instanceof Error ? error : new Error('Login failed');
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
      // Call logout API if token exists
      const token = this.getToken();
      if (token && !this.useMockData) {
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/logout`, {}).pipe(
            catchError(error => {
              console.warn('Logout API call failed:', error);
              return of(null); // Continue with local logout even if API fails
            })
          )
        );
      }
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
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    if (this.useMockData) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (currentPassword !== 'current123') {
        throw new Error('Current password is incorrect');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, {
          currentPassword,
          newPassword,
          confirmPassword
        }).pipe(
          catchError(this.handleAuthError)
        )
      );

      if (!response) {
        throw new Error('Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error instanceof Error ? error : new Error('Failed to change password');
    }
  }

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<User> {
    if (this.useMockData) {
      const currentUser = this.currentUserSubject.value;
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      return currentUser;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/profile`).pipe(
          catchError(this.handleAuthError)
        )
      );

      if (!response) {
        throw new Error('Failed to get user profile');
      }

      // Update current user subject
      this.currentUserSubject.next(response);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error instanceof Error ? error : new Error('Failed to get user profile');
    }
  }

  /**
   * Validate current token with server
   */
  async validateToken(): Promise<boolean> {
    if (this.useMockData || this.bypassAuthForDevelopment) {
      return true;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/validate`).pipe(
          catchError(error => {
            console.warn('Token validation failed:', error);
            return of(null);
          })
        )
      );

      return response?.valid === true;
    } catch (error) {
      console.warn('Token validation error:', error);
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    if (this.useMockData) {
      // For mock data, just generate a new token
      const mockToken = `mock-token-${Date.now()}`;
      this.storeToken(mockToken);
      return mockToken;
    }

    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {
          refreshToken: refreshToken
        }).pipe(
          catchError(this.handleAuthError)
        )
      );

      if (response?.success && response.token) {
        // Store new tokens
        this.storeAuthData(response, true); // Assume remember me for refresh
        this.currentUserSubject.next(response.user);
        return response.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.logout();
      throw error;
    }
  }

  /**
   * Get authorization header for API calls
   */
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  /**
   * Store authentication data
   */
  private storeAuthData(authResponse: AuthResponse, rememberMe: boolean = false): void {
    // Use localStorage if rememberMe is true, otherwise use sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(this.tokenKey, authResponse.token);
    storage.setItem(this.userKey, JSON.stringify(authResponse.user));
    
    // Store refresh token if available
    if (authResponse.refreshToken) {
      storage.setItem(this.refreshTokenKey, authResponse.refreshToken);
    }
    
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
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey) || 
           sessionStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Clear all stored authentication data
   */
  private clearAuthData(): void {
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(this.tokenKey);
      storage.removeItem(this.userKey);
      storage.removeItem(`${this.tokenKey}_expiry`);
      storage.removeItem(this.refreshTokenKey);
    });
  }

  /**
   * Get stored authentication token
   */
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || 
           sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Get current user from storage
   */
  private getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem(this.userKey) || 
                      sessionStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.warn('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Check if stored token is valid and not expired
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiryTime = localStorage.getItem(`${this.tokenKey}_expiry`) || 
                      sessionStorage.getItem(`${this.tokenKey}_expiry`);
    
    if (!expiryTime) return true; // Assume valid if no expiry set

    return Date.now() < parseInt(expiryTime, 10);
  }

  /**
   * Get mock user for development
   */
  private getMockUser(): User {
    return {
      id: 'mock-1',
      username: 'admin',
      email: 'admin@storemanagement.com',
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      avatar: 'https://ui-avatars.com/api/?name=System+Administrator&background=673ab7&color=fff',
      permissions: ['users.read', 'users.write', 'products.read', 'products.write', 'orders.read', 'orders.write', 'reports.read', 'settings.write'],
      department: 'IT Administration'
    };
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
