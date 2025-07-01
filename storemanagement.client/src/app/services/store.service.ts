import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { Store, CreateStoreRequest, StoreResponse, StoreUser, CreateUserRequest } from '../models/store.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/stores'; // This would be your actual API endpoint
  
  // Mock data for development
  private mockStores: Store[] = [
    {
      id: '1',
      name: 'Downtown Store',
      address: '123 Main Street, Downtown, Mumbai 400001',
      email: 'downtown@stores.com',
      phone: '+91-9876543210',
      storeKey: 'DT2024',
      makerUserId: 'maker_DT2024',
      checkerUserId: 'checker_DT2024',
      makerUsername: 'maker_DT2024',
      checkerUsername: 'checker_DT2024',
      createdDate: new Date('2024-01-15'),
      updatedDate: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Mall Branch',
      address: '456 Shopping Center, Mall District, Delhi 110001',
      email: 'mall@stores.com',
      phone: '+91-8765432109',
      storeKey: 'MB2024',
      makerUserId: 'maker_MB2024',
      checkerUserId: 'checker_MB2024',
      makerUsername: 'maker_MB2024',
      checkerUsername: 'checker_MB2024',
      createdDate: new Date('2024-02-20'),
      updatedDate: new Date('2024-03-01'),
      isActive: true
    },
    {
      id: '3',
      name: 'Airport Terminal',
      address: '789 Airport Road, Terminal 2, Bangalore 560001',
      email: 'airport@stores.com',
      phone: '+91-7654321098',
      storeKey: 'AT2024',
      makerUserId: 'maker_AT2024',
      checkerUserId: 'checker_AT2024',
      makerUsername: 'maker_AT2024',
      checkerUsername: 'checker_AT2024',
      createdDate: new Date('2024-03-10'),
      updatedDate: new Date('2024-03-10'),
      isActive: false
    }
  ];

  // Mock users data for development
  private mockUsers: StoreUser[] = [
    // Users for Downtown Store (DT2024)
    {
      id: 'maker_DT2024',
      username: 'maker_DT2024',
      email: 'maker_DT2024@store.com',
      firstName: 'John',
      lastName: 'Maker',
      role: 'maker',
      storeId: '1',
      storeKey: 'DT2024',
      isActive: true,
      createdDate: new Date('2024-01-15')
    },
    {
      id: 'checker_DT2024',
      username: 'checker_DT2024',
      email: 'checker_DT2024@store.com',
      firstName: 'Jane',
      lastName: 'Checker',
      role: 'checker',
      storeId: '1',
      storeKey: 'DT2024',
      isActive: true,
      createdDate: new Date('2024-01-15')
    },
    // Users for Mall Branch (MB2024)
    {
      id: 'maker_MB2024',
      username: 'maker_MB2024',
      email: 'maker_MB2024@store.com',
      firstName: 'Mike',
      lastName: 'Maker',
      role: 'maker',
      storeId: '2',
      storeKey: 'MB2024',
      isActive: true,
      createdDate: new Date('2024-02-20')
    },
    {
      id: 'checker_MB2024',
      username: 'checker_MB2024',
      email: 'checker_MB2024@store.com',
      firstName: 'Sarah',
      lastName: 'Checker',
      role: 'checker',
      storeId: '2',
      storeKey: 'MB2024',
      isActive: true,
      createdDate: new Date('2024-02-20')
    },
    // Users for Airport Terminal (AT2024)
    {
      id: 'maker_AT2024',
      username: 'maker_AT2024',
      email: 'maker_AT2024@store.com',
      firstName: 'Alex',
      lastName: 'Maker',
      role: 'maker',
      storeId: '3',
      storeKey: 'AT2024',
      isActive: true,
      createdDate: new Date('2024-03-10')
    },
    {
      id: 'checker_AT2024',
      username: 'checker_AT2024',
      email: 'checker_AT2024@store.com',
      firstName: 'Lisa',
      lastName: 'Checker',
      role: 'checker',
      storeId: '3',
      storeKey: 'AT2024',
      isActive: false,
      createdDate: new Date('2024-03-10')
    }
  ];

  // Signals for reactive state management
  private storesSignal = signal<Store[]>(this.mockStores);
  private usersSignal = signal<StoreUser[]>(this.mockUsers);
  private isLoadingSignal = signal<boolean>(false);
  
  // Public readonly signals
  readonly storesData = this.storesSignal.asReadonly();
  readonly usersData = this.usersSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  
  // Computed signals
  readonly activeStoresCount = computed(() => 
    this.storesSignal().filter((store: Store) => store.isActive).length
  );
  readonly inactiveStoresCount = computed(() => 
    this.storesSignal().filter((store: Store) => !store.isActive).length
  );
  readonly totalStoresCount = computed(() => this.storesSignal().length);

  private storesSubject = new BehaviorSubject<Store[]>(this.mockStores);
  public stores$ = this.storesSubject.asObservable();

  // Helper method to update both BehaviorSubject and Signal
  private updateStoresState(): void {
    this.storesSignal.set([...this.mockStores]);
    this.storesSubject.next([...this.mockStores]);
  }

  // Get all stores
  getStores(): Observable<StoreResponse> {
    // Simulate API call
    return of({
      success: true,
      message: 'Stores retrieved successfully',
      stores: this.mockStores
    }).pipe(delay(500)); // Simulate network delay
  }

  // Get store by ID
  getStoreById(id: string): Observable<StoreResponse> {
    const store = this.mockStores.find(s => s.id === id);
    return of({
      success: !!store,
      message: store ? 'Store found' : 'Store not found',
      store: store
    }).pipe(delay(300));
  }

  // Get store by store key
  getStoreByKey(storeKey: string): Observable<StoreResponse> {
    const store = this.mockStores.find(s => s.storeKey === storeKey);
    return of({
      success: !!store,
      message: store ? 'Store found' : 'Store not found',
      store: store
    }).pipe(delay(300));
  }

  // Create new store
  createStore(storeData: CreateStoreRequest): Observable<StoreResponse> {
    // Validate store key uniqueness
    if (this.mockStores.some(s => s.storeKey === storeData.storeKey)) {
      return of({
        success: false,
        message: 'Store key already exists. Please use a different store key (minimum 6 alphanumeric characters).'
      });
    }

    // Validate store key format (minimum 6 alphanumeric characters)
    if (!/^[A-Za-z0-9]{6,}$/.test(storeData.storeKey)) {
      return of({
        success: false,
        message: 'Store key must be at least 6 alphanumeric characters (letters and numbers only).'
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeData.email)) {
      return of({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Validate phone format (Indian standard)
    if (!/^\+91-[6-9]\d{9}$/.test(storeData.phone)) {
      return of({
        success: false,
        message: 'Phone number must be in Indian format: +91-XXXXXXXXXX (10 digits starting with 6-9).'
      });
    }

    // Create the store
    const newStore: Store = {
      id: this.generateId(),
      name: storeData.name,
      address: storeData.address,
      email: storeData.email,
      phone: storeData.phone,
      storeKey: storeData.storeKey.toUpperCase(),
      makerUserId: `maker_${storeData.storeKey}`,
      checkerUserId: `checker_${storeData.storeKey}`,
      makerUsername: `maker_${storeData.storeKey}`,
      checkerUsername: `checker_${storeData.storeKey}`,
      createdDate: new Date(),
      updatedDate: new Date(),
      isActive: true
    };

    // Create default users
    const makerUser: StoreUser = {
      id: newStore.makerUserId!,
      username: newStore.makerUsername!,
      email: `maker_${storeData.storeKey.toUpperCase()}@store.com`,
      role: 'maker',
      storeId: newStore.id!,
      storeKey: storeData.storeKey.toUpperCase(),
      isActive: true,
      createdDate: new Date()
    };

    const checkerUser: StoreUser = {
      id: newStore.checkerUserId!,
      username: newStore.checkerUsername!,
      email: `checker_${storeData.storeKey.toUpperCase()}@store.com`,
      role: 'checker',
      storeId: newStore.id!,
      storeKey: storeData.storeKey.toUpperCase(),
      isActive: true,
      createdDate: new Date()
    };

    this.mockStores.push(newStore);
    this.updateStoresState();

    return of({
      success: true,
      message: 'Store created successfully with default maker and checker users',
      store: newStore,
      makerUser: makerUser,
      checkerUser: checkerUser
    }).pipe(delay(800));
  }

  // Update store
  updateStore(id: string, storeData: Partial<Store>): Observable<StoreResponse> {
    const index = this.mockStores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    // If updating store key, validate uniqueness
    if (storeData.storeKey && storeData.storeKey !== this.mockStores[index].storeKey) {
      if (this.mockStores.some((s, i) => i !== index && s.storeKey === storeData.storeKey)) {
        return of({
          success: false,
          message: 'Store key already exists. Please use a different store key (minimum 6 alphanumeric characters).'
        });
      }

      if (!/^[A-Za-z0-9]{6,}$/.test(storeData.storeKey)) {
        return of({
          success: false,
          message: 'Store key must be at least 6 alphanumeric characters (letters and numbers only).'
        });
      }

      // Convert to uppercase
      storeData.storeKey = storeData.storeKey.toUpperCase();
    }

    // Validate email if provided
    if (storeData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeData.email)) {
      return of({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Validate phone if provided
    if (storeData.phone && !/^\+91-[6-9]\d{9}$/.test(storeData.phone)) {
      return of({
        success: false,
        message: 'Phone number must be in Indian format: +91-XXXXXXXXXX (10 digits starting with 6-9).'
      });
    }

    const updatedStore: Store = {
      ...this.mockStores[index],
      ...storeData,
      updatedDate: new Date()
    };

    this.mockStores[index] = updatedStore;
    this.updateStoresState();

    return of({
      success: true,
      message: 'Store updated successfully',
      store: updatedStore
    }).pipe(delay(600));
  }

  // Delete store
  deleteStore(id: string): Observable<StoreResponse> {
    const index = this.mockStores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    const deletedStore = this.mockStores[index];
    this.mockStores.splice(index, 1);
    this.updateStoresState();

    return of({
      success: true,
      message: `Store "${deletedStore.name}" deleted successfully`,
      store: deletedStore
    }).pipe(delay(400));
  }

  // Toggle store status
  toggleStoreStatus(id: string): Observable<StoreResponse> {
    const index = this.mockStores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    this.mockStores[index].isActive = !this.mockStores[index].isActive;
    this.mockStores[index].updatedDate = new Date();
    this.updateStoresState();

    return of({
      success: true,
      message: `Store "${this.mockStores[index].name}" ${this.mockStores[index].isActive ? 'activated' : 'deactivated'} successfully`,
      store: this.mockStores[index]
    }).pipe(delay(300));
  }

  // Generate random 6-character alphanumeric store key
  generateStoreKey(): string {
    let storeKey: string;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    do {
      storeKey = '';
      for (let i = 0; i < 6; i++) {
        storeKey += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.mockStores.some(s => s.storeKey === storeKey));
    return storeKey;
  }

  // Validate store key
  validateStoreKey(storeKey: string, excludeId?: string): Observable<boolean> {
    const exists = this.mockStores.some(s => s.storeKey === storeKey && s.id !== excludeId);
    return of(!exists).pipe(delay(200));
  }

  // Format phone number to Indian standard
  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's already 10 digits and starts with 6-9, format it
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      return `+91-${digits}`;
    }
    
    // If it's 12 digits and starts with 91, format it
    if (digits.length === 12 && digits.startsWith('91')) {
      const mobileNumber = digits.substring(2);
      if (/^[6-9]/.test(mobileNumber)) {
        return `+91-${mobileNumber}`;
      }
    }
    
    return phone; // Return as is if doesn't match expected format
  }

  // User Management Methods
  
  // Get users for a store
  getStoreUsers(storeId: string): Observable<{success: boolean, message: string, users?: StoreUser[]}> {
    const store = this.mockStores.find(s => s.id === storeId);
    if (!store) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    // Filter users for this store
    const users = this.mockUsers.filter(u => u.storeId === storeId);

    return of({
      success: true,
      message: 'Users retrieved successfully',
      users: users
    }).pipe(delay(300));
  }

  // Update user
  updateUser(userId: string, userData: Partial<StoreUser>): Observable<{success: boolean, message: string, user?: StoreUser}> {
    // For demo purposes, we'll simulate updating the user
    // In real implementation, this would update the user in the database
    return of({
      success: true,
      message: 'User updated successfully',
      user: {
        id: userId,
        username: userData.username || '',
        email: userData.email || '',
        role: (userData.role || 'maker') as 'maker' | 'checker',
        storeId: '',
        storeKey: '',
        isActive: userData.isActive ?? true,
        createdDate: new Date()
      }
    }).pipe(delay(400));
  }

  // Change user password
  changeUserPassword(userId: string, newPassword: string): Observable<{success: boolean, message: string}> {
    // Password validation
    if (!newPassword || newPassword.length < 8) {
      return of({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return of({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
      });
    }

    // Simulate password change
    return of({
      success: true,
      message: 'Password changed successfully!'
    }).pipe(delay(500));
  }

  // Toggle user status
  toggleUserStatus(userId: string): Observable<{success: boolean, message: string, user?: StoreUser}> {
    // Simulate toggling user status
    return of({
      success: true,
      message: 'User status updated successfully',
      user: {
        id: userId,
        username: '',
        email: '',
        role: 'maker' as 'maker' | 'checker',
        storeId: '',
        storeKey: '',
        isActive: true,
        createdDate: new Date()
      }
    }).pipe(delay(300));
  }

  // Create a new user for a store
  createUser(userData: CreateUserRequest): Observable<{success: boolean, message: string, user?: StoreUser}> {
    // Find the store to get storeKey
    const store = this.mockStores.find(s => s.id === userData.storeId);
    if (!store) {
      return of({
        success: false,
        message: 'Store not found'
      }).pipe(delay(300));
    }

    // Check if username already exists in any store
    const existingUser = this.mockUsers.find((u: StoreUser) => u.username === userData.username);
    if (existingUser) {
      return of({
        success: false,
        message: 'Username already exists'
      }).pipe(delay(300));
    }

    // Check if email already exists in any store
    const existingEmail = this.mockUsers.find((u: StoreUser) => u.email === userData.email);
    if (existingEmail) {
      return of({
        success: false,
        message: 'Email already exists'
      }).pipe(delay(300));
    }

    // Create new user
    const newUser: StoreUser = {
      id: this.generateId(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      storeId: userData.storeId,
      storeKey: store.storeKey,
      isActive: true,
      createdDate: new Date()
    };

    // Add to mock users array
    this.mockUsers.push(newUser);

    return of({
      success: true,
      message: `User "${userData.username}" created successfully!`,
      user: newUser
    }).pipe(delay(500));
  }

  // Create a default maker user for a store
  createDefaultMaker(storeId: string): Observable<{success: boolean, message: string, user?: StoreUser}> {
    const store = this.mockStores.find(s => s.id === storeId);
    if (!store) {
      return of({
        success: false,
        message: 'Store not found'
      }).pipe(delay(300));
    }

    // Check if maker already exists for this store
    const existingMaker = this.mockUsers.find(u => u.storeId === storeId && u.role === 'maker');
    if (existingMaker) {
      return of({
        success: false,
        message: 'Maker user already exists for this store'
      }).pipe(delay(300));
    }

    // Create default maker user
    const makerUser: StoreUser = {
      id: this.generateId(),
      username: `maker_${store.storeKey}`,
      email: `maker_${store.storeKey.toLowerCase()}@store.com`,
      firstName: 'Default',
      lastName: 'Maker',
      role: 'maker',
      storeId: storeId,
      storeKey: store.storeKey,
      isActive: true,
      createdDate: new Date()
    };

    // Add to mock users array
    this.mockUsers.push(makerUser);

    return of({
      success: true,
      message: `Default maker user created successfully for store "${store.name}"!`,
      user: makerUser
    }).pipe(delay(500));
  }

  // Create a default checker user for a store
  createDefaultChecker(storeId: string): Observable<{success: boolean, message: string, user?: StoreUser}> {
    const store = this.mockStores.find(s => s.id === storeId);
    if (!store) {
      return of({
        success: false,
        message: 'Store not found'
      }).pipe(delay(300));
    }

    // Check if checker already exists for this store
    const existingChecker = this.mockUsers.find(u => u.storeId === storeId && u.role === 'checker');
    if (existingChecker) {
      return of({
        success: false,
        message: 'Checker user already exists for this store'
      }).pipe(delay(300));
    }

    // Create default checker user
    const checkerUser: StoreUser = {
      id: this.generateId(),
      username: `checker_${store.storeKey}`,
      email: `checker_${store.storeKey.toLowerCase()}@store.com`,
      firstName: 'Default',
      lastName: 'Checker',
      role: 'checker',
      storeId: storeId,
      storeKey: store.storeKey,
      isActive: true,
      createdDate: new Date()
    };

    // Add to mock users array
    this.mockUsers.push(checkerUser);

    return of({
      success: true,
      message: `Default checker user created successfully for store "${store.name}"!`,
      user: checkerUser
    }).pipe(delay(500));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
