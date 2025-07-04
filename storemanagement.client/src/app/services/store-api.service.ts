import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Define interfaces for the API responses
export interface Store {
  id?: number;
  storeId?: number;
  store_id?: number;
  name?: string;
  storeName?: string;
  store_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  zip_code?: string;
  email?: string;
  phone?: string;
  storeKey?: string;
  store_key?: string;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: Date;
  created_at?: string;
  updatedAt?: Date;
  updated_at?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  stores?: Store[];
  store?: Store;
  data?: any;
}

export interface CreateStoreRequest {
  storeName: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email: string;
  isActive?: boolean;
}

// User interface for store users
export interface StoreUser {
  id?: string;
  user_id?: string;
  userId?: string;
  username?: string;
  user_name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  storeId?: string;
  store_id?: string;
  storeKey?: string;
  store_key?: string;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: Date;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl; // Use environment variable

  // Get all stores from SuperAdminController
  getStores(): Observable<ApiResponse> {
    return this.http.get<Store[]>(`${this.apiUrl}/storelist`).pipe(
      map(response => {
        const stores = Array.isArray(response) ? response.map(store => this.transformStore(store)) : [];
        return {
          success: true,
          message: 'Stores retrieved successfully',
          stores: stores
        };
      }),
      catchError(error => {
        console.error('Error fetching stores:', error);
        return of({
          success: false,
          message: 'Failed to retrieve stores',
          stores: []
        });
      })
    );
  }

  // Get store by ID from SuperAdminController
  getStoreById(storeId: number): Observable<ApiResponse> {
    return this.http.get<Store>(`${this.apiUrl}/store/${storeId}`).pipe(
      map(response => ({
        success: true,
        message: 'Store retrieved successfully',
        store: this.transformStore(response)
      })),
      catchError(error => {
        console.error('Error fetching store:', error);
        return of({
          success: false,
          message: 'Store not found'
        });
      })
    );
  }

  // Create new store using SuperAdminController
  createStore(request: CreateStoreRequest): Observable<ApiResponse> {
    return this.http.post<any>(`${this.apiUrl}/createStore`, request).pipe(
      map(response => ({
        success: true,
        message: 'Store created successfully with default maker and checker users!',
        store: this.transformStore(response)
      })),
      catchError(error => {
        console.error('Error creating store:', error);
        return of({
          success: false,
          message: 'Failed to create store'
        });
      })
    );
  }

  // Toggle store status using SuperAdminController blockStore endpoint
  toggleStoreStatus(storeId: number): Observable<ApiResponse> {
    const blockRequest = {
      storeId: storeId,
      isBlocked: true // This should be determined based on current status
    };

    return this.http.post<any>(`${this.apiUrl}/blockStore`, blockRequest).pipe(
      map(response => ({
        success: response.Success || true,
        message: response.Message || 'Store status updated successfully',
        data: response
      })),
      catchError(error => {
        console.error('Error toggling store status:', error);
        return of({
          success: false,
          message: 'Failed to update store status'
        });
      })
    );
  }

  // Get users for a specific store
  getStoreUsers(storeId: number): Observable<ApiResponse> {
    return this.http.get<any[]>(`${this.apiUrl}/getStoreUsers/${storeId}`).pipe(
      map(response => ({
        success: true,
        message: 'Store users retrieved successfully',
        data: response || []
      })),
      catchError(error => {
        console.error('Error fetching store users:', error);
        return of({
          success: false,
          message: 'Failed to retrieve store users',
          data: []
        });
      })
    );
  }

  // Create store user using SuperAdminController
  createStoreUser(request: any): Observable<ApiResponse> {
    return this.http.post<any>(`${this.apiUrl}/createUser`, request).pipe(
      map(response => ({
        success: true,
        message: 'Store user created successfully',
        data: response
      })),
      catchError(error => {
        console.error('Error creating store user:', error);
        return of({
          success: false,
          message: 'Failed to create store user'
        });
      })
    );
  }

  // Block user using SuperAdminController
  blockUser(userId: string): Observable<ApiResponse> {
    const blockRequest = {
      userId: userId,
      isBlocked: true
    };

    return this.http.post<any>(`${this.apiUrl}/blockUser`, blockRequest).pipe(
      map(response => ({
        success: response.Success || true,
        message: response.Message || 'User blocked successfully',
        data: response
      })),
      catchError(error => {
        console.error('Error blocking user:', error);
        return of({
          success: false,
          message: 'Failed to block user'
        });
      })
    );
  }

  // Reset password using SuperAdminController
  resetPassword(userId: string): Observable<ApiResponse> {
    const resetRequest = {
      userId: userId
    };

    return this.http.post<any>(`${this.apiUrl}/passwordReset`, resetRequest).pipe(
      map(response => ({
        success: response.Success || true,
        message: response.Message || 'Password reset email sent successfully',
        data: response
      })),
      catchError(error => {
        console.error('Error resetting password:', error);
        return of({
          success: false,
          message: 'Failed to reset password'
        });
      })
    );
  }

  // Delete store (placeholder - not implemented in SuperAdminController)
  deleteStore(storeId: number): Observable<ApiResponse> {
    // Since SuperAdminController doesn't have delete endpoint,
    // we'll return a placeholder response
    return of({
      success: false,
      message: 'Delete functionality not implemented in the API yet'
    }).pipe(delay(500));
  }

  // Toggle user status (placeholder - using blockUser endpoint)
  toggleUserStatus(userId: string): Observable<ApiResponse> {
    return this.blockUser(userId);
  }

  // Create default maker user (this happens automatically when creating a store)
  createDefaultMaker(storeId: number): Observable<ApiResponse> {
    // Since SuperAdminController creates default users automatically when creating a store,
    // this might not be needed as a separate endpoint
    return of({
      success: false,
      message: 'Default maker users are created automatically when creating a store'
    }).pipe(delay(500));
  }

  // Create default checker user (this happens automatically when creating a store)
  createDefaultChecker(storeId: number): Observable<ApiResponse> {
    // Since SuperAdminController creates default users automatically when creating a store,
    // this might not be needed as a separate endpoint
    return of({
      success: false,
      message: 'Default checker users are created automatically when creating a store'
    }).pipe(delay(500));
  }

  // Update user (placeholder - endpoint not implemented in backend yet)
  updateUser(userId: string, userData: any): Observable<ApiResponse> {
    // Note: The backend doesn't have a user update endpoint yet
    // This is a placeholder implementation
    return of({
      success: false,
      message: 'User update functionality is not yet implemented in the backend API'
    }).pipe(delay(500));
  }

  // Update store (placeholder - endpoint not implemented in backend yet)
  updateStore(storeId: number, updateData: any): Observable<ApiResponse> {
    // Note: The backend doesn't have a store update endpoint yet
    // This is a placeholder implementation
    return of({
      success: false,
      message: 'Store update functionality is not yet implemented in the backend API'
    }).pipe(delay(500));
  }

  // Transform store data from database format to UI format
  private transformStore(store: any): Store {
    if (!store) return {};
    
    return {
      id: store.store_id || store.storeId || store.id,
      name: store.store_name || store.storeName || store.name,
      address: this.formatAddress(store),
      email: store.email,
      phone: store.phone,
      storeKey: store.store_key || store.storeKey || this.generateStoreKey(),
      isActive: store.is_active !== undefined ? store.is_active : store.isActive !== undefined ? store.isActive : true,
      createdAt: store.created_at ? new Date(store.created_at) : store.createdAt ? new Date(store.createdAt) : new Date(),
      updatedAt: store.updated_at ? new Date(store.updated_at) : store.updatedAt ? new Date(store.updatedAt) : new Date()
    };
  }

  // Format address from database fields
  private formatAddress(store: any): string {
    const parts = [
      store.address,
      store.city,
      store.state,
      store.zip_code || store.zipCode
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ') || '';
  }

  // Utility methods for form handling
  generateStoreKey(): string {
    const prefix = 'STR';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as +91-XXXXX-XXXXX for Indian numbers
    if (cleaned.length === 10) {
      return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return phone; // Return original if doesn't match expected format
  }
}
