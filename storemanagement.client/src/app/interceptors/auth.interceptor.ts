import { inject } from '@angular/core';
import { 
  HttpInterceptorFn,
  HttpRequest, 
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable, throwError, switchMap, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Add authentication token to requests
  const authRequest = addAuthToken(request, authService);

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && !request.url.includes('/auth/login')) {
        // Try to refresh token
        return handle401Error(request, next, authService);
      }

      return throwError(() => error);
    })
  );
};

function addAuthToken(request: HttpRequest<unknown>, authService: AuthService): HttpRequest<unknown> {
  const token = authService.getToken();
  
  if (token && !request.headers.has('Authorization')) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return request;
}

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
  return from(authService.refreshToken()).pipe(
    switchMap((newToken: string) => {
      // Retry the original request with new token
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken}`
        }
      });
      return next(authRequest);
    }),
    catchError((error) => {
      // If refresh fails, logout user
      authService.logout();
      return throwError(() => error);
    })
  );
}
