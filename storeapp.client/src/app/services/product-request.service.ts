import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductRequestService {
  private baseUrl = '/api/ProductRequest';

  constructor(private http: HttpClient) {}

  createProductRequest(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, request);
  }

  approveRequest(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve`, request);
  }

  rejectRequest(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject`, request);
  }

  getRequestDetails(requestId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${requestId}`);
  }

  getAuditLog(requestId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${requestId}/auditlog`);
  }
}
