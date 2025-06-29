import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Store, CreateStoreRequest, StoreResponse, StoreUser } from '../models/store.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/stores'; // This would be your actual API endpoint
  
  // Mock data for development
  private stores: Store[] = [
    {
      id: '1',
      name: 'Downtown Store',
      address: '123 Main Street, Downtown, City 12345',
      phone: '+1-555-0123',
      storeKey: '12345678',
      makerUserId: 'maker_12345678',
      checkerUserId: 'checker_12345678',
      makerUsername: 'maker_12345678',
      checkerUsername: 'checker_12345678',
      createdDate: new Date('2024-01-15'),
      updatedDate: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Mall Branch',
      address: '456 Shopping Center, Mall District, City 67890',
      phone: '+1-555-0456',
      storeKey: '87654321',
      makerUserId: 'maker_87654321',
      checkerUserId: 'checker_87654321',
      makerUsername: 'maker_87654321',
      checkerUsername: 'checker_87654321',
      createdDate: new Date('2024-02-20'),
      updatedDate: new Date('2024-03-01'),
      isActive: true
    },
    {
      id: '3',
      name: 'Airport Terminal',
      address: '789 Airport Road, Terminal 2, City 13579',
      phone: '+1-555-0789',
      storeKey: '24681357',
      makerUserId: 'maker_24681357',
      checkerUserId: 'checker_24681357',
      makerUsername: 'maker_24681357',
      checkerUsername: 'checker_24681357',
      createdDate: new Date('2024-03-10'),
      updatedDate: new Date('2024-03-10'),
      isActive: false
    }
  ];

  private storesSubject = new BehaviorSubject<Store[]>(this.stores);
  public stores$ = this.storesSubject.asObservable();

  // Get all stores
  getStores(): Observable<StoreResponse> {
    // Simulate API call
    return of({
      success: true,
      message: 'Stores retrieved successfully',
      stores: this.stores
    }).pipe(delay(500)); // Simulate network delay
  }

  // Get store by ID
  getStoreById(id: string): Observable<StoreResponse> {
    const store = this.stores.find(s => s.id === id);
    return of({
      success: !!store,
      message: store ? 'Store found' : 'Store not found',
      store: store
    }).pipe(delay(300));
  }

  // Get store by store key
  getStoreByKey(storeKey: string): Observable<StoreResponse> {
    const store = this.stores.find(s => s.storeKey === storeKey);
    return of({
      success: !!store,
      message: store ? 'Store found' : 'Store not found',
      store: store
    }).pipe(delay(300));
  }

  // Create new store
  createStore(storeData: CreateStoreRequest): Observable<StoreResponse> {
    // Validate store key uniqueness
    if (this.stores.some(s => s.storeKey === storeData.storeKey)) {
      return of({
        success: false,
        message: 'Store key already exists. Please use a different 8-digit number.'
      });
    }

    // Validate store key format (8 digits)
    if (!/^\d{8}$/.test(storeData.storeKey)) {
      return of({
        success: false,
        message: 'Store key must be exactly 8 digits.'
      });
    }

    // Create the store
    const newStore: Store = {
      id: this.generateId(),
      name: storeData.name,
      address: storeData.address,
      phone: storeData.phone,
      storeKey: storeData.storeKey,
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
      email: `maker_${storeData.storeKey}@store.com`,
      role: 'maker',
      storeId: newStore.id!,
      storeKey: storeData.storeKey,
      isActive: true,
      createdDate: new Date()
    };

    const checkerUser: StoreUser = {
      id: newStore.checkerUserId!,
      username: newStore.checkerUsername!,
      email: `checker_${storeData.storeKey}@store.com`,
      role: 'checker',
      storeId: newStore.id!,
      storeKey: storeData.storeKey,
      isActive: true,
      createdDate: new Date()
    };

    this.stores.push(newStore);
    this.storesSubject.next([...this.stores]);

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
    const index = this.stores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    // If updating store key, validate uniqueness
    if (storeData.storeKey && storeData.storeKey !== this.stores[index].storeKey) {
      if (this.stores.some((s, i) => i !== index && s.storeKey === storeData.storeKey)) {
        return of({
          success: false,
          message: 'Store key already exists. Please use a different 8-digit number.'
        });
      }

      if (!/^\d{8}$/.test(storeData.storeKey)) {
        return of({
          success: false,
          message: 'Store key must be exactly 8 digits.'
        });
      }
    }

    const updatedStore: Store = {
      ...this.stores[index],
      ...storeData,
      updatedDate: new Date()
    };

    this.stores[index] = updatedStore;
    this.storesSubject.next([...this.stores]);

    return of({
      success: true,
      message: 'Store updated successfully',
      store: updatedStore
    }).pipe(delay(600));
  }

  // Delete store
  deleteStore(id: string): Observable<StoreResponse> {
    const index = this.stores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    const deletedStore = this.stores[index];
    this.stores.splice(index, 1);
    this.storesSubject.next([...this.stores]);

    return of({
      success: true,
      message: 'Store deleted successfully',
      store: deletedStore
    }).pipe(delay(400));
  }

  // Toggle store status
  toggleStoreStatus(id: string): Observable<StoreResponse> {
    const index = this.stores.findIndex(s => s.id === id);
    
    if (index === -1) {
      return of({
        success: false,
        message: 'Store not found'
      });
    }

    this.stores[index].isActive = !this.stores[index].isActive;
    this.stores[index].updatedDate = new Date();
    this.storesSubject.next([...this.stores]);

    return of({
      success: true,
      message: `Store ${this.stores[index].isActive ? 'activated' : 'deactivated'} successfully`,
      store: this.stores[index]
    }).pipe(delay(300));
  }

  // Generate random 8-digit store key
  generateStoreKey(): string {
    let storeKey: string;
    do {
      storeKey = Math.floor(10000000 + Math.random() * 90000000).toString();
    } while (this.stores.some(s => s.storeKey === storeKey));
    return storeKey;
  }

  // Validate store key
  validateStoreKey(storeKey: string, excludeId?: string): Observable<boolean> {
    const exists = this.stores.some(s => s.storeKey === storeKey && s.id !== excludeId);
    return of(!exists).pipe(delay(200));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
