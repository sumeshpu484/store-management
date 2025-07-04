import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login, refresh, and public endpoints
    if (this.shouldSkipAuth(request.url)) {
      return next.handle(request);
    }

    // Add auth token to request
    request = this.addAuthToken(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 errors by attempting token refresh
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private shouldSkipAuth(url: string): boolean {
    const skipUrls = [
      '/api/auth/login',
      '/api/auth/refresh',
      '/assets/',
      'mock-data'
    ];
    
    return skipUrls.some(skipUrl => url.includes(skipUrl));
  }

  private addAuthToken(request: HttpRequest<any>): HttpRequest<any> {
    const authHeaders = this.authService.getAuthHeaders();
    
    if (authHeaders['Authorization']) {
      return request.clone({
        setHeaders: authHeaders
      });
    }

    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return new Observable(observer => {
        this.authService.refreshToken().then((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          
          // Retry the original request with new token
          next.handle(this.addAuthToken(request)).subscribe({
            next: event => observer.next(event),
            error: err => observer.error(err),
            complete: () => observer.complete()
          });
        }).catch((error: any) => {
          this.isRefreshing = false;
          this.authService.logout();
          observer.error(error);
        });
      });
    }

    // If we're already refreshing, wait for the new token
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(this.addAuthToken(request)))
    );
  }
}
