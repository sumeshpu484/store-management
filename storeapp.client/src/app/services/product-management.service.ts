import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductManagementService {
  private baseUrl = '/api/ProductManagement';

  constructor(private http: HttpClient) {}

  // Product CRUD
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getProduct(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${productId}`);
  }

  createProduct(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, request);
  }

  updateProduct(request: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, request);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }

  activateProduct(productId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${productId}/activate`, {});
  }

  deactivateProduct(productId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${productId}/deactivate`, {});
  }

  // Category CRUD
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`);
  }

  getCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/${categoryId}`);
  }

  createCategory(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/category`, request);
  }

  updateCategory(request: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/category`, request);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/category/${categoryId}`);
  }

  activateCategory(categoryId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/category/${categoryId}/activate`, {});
  }

  deactivateCategory(categoryId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/category/${categoryId}/deactivate`, {});
  }
}
