import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private baseUrl = '/superadmin';

  constructor(private http: HttpClient) {}

  // Store management
  createStore(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createStore`, request);
  }

  getAllStores(): Observable<any> {
    return this.http.get(`${this.baseUrl}/storelist`);
  }

  getStoreDetails(storeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/store/${storeId}`);
  }

  // User management
  createUser(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createUser`, request);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/userlist`);
  }

  getStoreUsers(storeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getStoreUsers/${storeId}`);
  }

  // Block/unblock user
  blockUser(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/blockUser`, request);
  }

  unblockUser(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/unblockUser`, request);
  }

  // Block/unblock store
  blockStore(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/blockStore`, request);
  }

  // Password reset
  passwordReset(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/passwordReset`, request);
  }
}
