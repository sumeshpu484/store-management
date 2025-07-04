# Angular Frontend Authentication Integration

## Overview
Complete integration of Angular frontend with the .NET Core authentication API. The system now supports real database authentication with JWT tokens, refresh tokens, and role-based access control.

## Integration Components

### 1. Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7071/superadmin',
  authApiUrl: 'https://localhost:7071/api/auth'
};
```

### 2. Updated AuthService (`src/app/services/auth.service.ts`)

#### Key Features
- **Real API Integration**: Uses `environment.authApiUrl` instead of mock data
- **JWT Token Management**: Stores and manages access tokens and refresh tokens
- **Automatic Token Refresh**: Handles token expiration automatically
- **Secure Storage**: Uses localStorage/sessionStorage based on "Remember Me" option
- **Error Handling**: Comprehensive error handling for different API responses

#### Methods Available
```typescript
// Authentication
async login(credentials: LoginCredentials): Promise<AuthResponse>
async logout(): Promise<void>
async refreshToken(): Promise<string>

// User Management  
async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void>
async getUserProfile(): Promise<User>
async validateToken(): Promise<boolean>

// Utility Methods
getAuthHeaders(): { [header: string]: string }
hasPermission(permission: string): boolean
hasRole(role: string): boolean
isAuthenticated(): boolean

// Observables
isAuthenticated$: Observable<boolean>
currentUser$: Observable<User | null>
```

### 3. HTTP Interceptor (`src/app/services/auth.interceptor.ts`)

#### Features
- **Automatic Token Injection**: Adds Bearer token to all API requests
- **Auto Token Refresh**: Handles 401 errors by refreshing tokens
- **Request Queuing**: Queues requests during token refresh
- **Selective Application**: Skips auth for login, refresh, and public endpoints

#### Configuration
```typescript
// Added to app.module.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

### 4. Login Component (`src/app/login/login.component.ts`)

#### Updated Features
- **Real API Calls**: Now calls `authService.login()` instead of mock methods
- **Enhanced Error Handling**: Displays specific error messages from API
- **Form Validation**: Client-side validation with server-side error feedback
- **Loading States**: Shows spinner during authentication

#### Test Credentials
```typescript
// Default users created by backend seeding
{
  username: 'admin',
  password: 'admin123'
} // Superadmin access

{
  username: 'store_manager', 
  password: 'manager123'
} // Store manager access
```

## API Integration Details

### Authentication Flow
1. **Login Request**: POST to `/api/auth/login`
2. **Token Storage**: Stores JWT and refresh token based on "Remember Me"
3. **Automatic Headers**: Interceptor adds `Authorization: Bearer <token>` to requests
4. **Token Refresh**: Auto-refreshes on 401 errors using refresh token
5. **Logout**: Calls `/api/auth/logout` and clears local storage

### Token Management
```typescript
// Token storage structure
localStorage/sessionStorage: {
  'auth_token': 'jwt-token-here',
  'auth_user': '{"id":"...", "username":"...", ...}',
  'refresh_token': 'refresh-token-here',
  'auth_token_expiry': '1641234567890'
}
```

### Error Handling
```typescript
// API Error Responses
400: Invalid credentials
401: Unauthorized (triggers auto-refresh)
403: Access forbidden  
429: Too many login attempts
500: Server error
0: Connection error
```

## Security Features

### Frontend Security
- **JWT Token Expiration**: Automatically handles token expiry
- **Secure Storage**: Sensitive data stored in browser storage
- **CSRF Protection**: Uses proper HTTP-only authentication
- **Input Validation**: Client-side form validation
- **Error Sanitization**: Prevents sensitive error exposure

### API Communication
- **HTTPS Only**: All API calls use HTTPS in production
- **Bearer Token Authentication**: Industry standard JWT implementation
- **Automatic Token Refresh**: Seamless user experience
- **Role-Based Access**: Permission checking at component level

## Usage Examples

### Basic Authentication Check
```typescript
// In any component
export class MyComponent {
  private authService = inject(AuthService);
  
  ngOnInit() {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      console.log('User is logged in');
    }
    
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(isAuth => {
      console.log('Auth state changed:', isAuth);
    });
  }
}
```

### Permission-Based Access
```typescript
// Check user permissions
if (this.authService.hasPermission('users.write')) {
  // Show admin controls
}

// Check user role
if (this.authService.hasRole('superadmin')) {
  // Show superadmin features
}
```

### Manual API Calls with Auth
```typescript
// The interceptor automatically adds auth headers
this.http.get('/api/protected-endpoint').subscribe(data => {
  // Request includes: Authorization: Bearer <token>
});
```

### Password Change
```typescript
async changePassword() {
  try {
    await this.authService.changePassword(
      this.currentPassword,
      this.newPassword, 
      this.confirmPassword
    );
    console.log('Password changed successfully');
  } catch (error) {
    console.error('Password change failed:', error.message);
  }
}
```

## Configuration Options

### Development Mode
```typescript
// In auth.service.ts
private readonly useMockData = false; // Set to true for offline development
private readonly bypassAuthForDevelopment = false; // Set to true to skip auth entirely
```

### Environment URLs
```typescript
// Update these for different environments
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7071/superadmin',
  authApiUrl: 'https://localhost:7071/api/auth'
};
```

## Testing the Integration

### 1. Start the Backend
```bash
cd StoreApp.Server
dotnet run
```

### 2. Start the Frontend  
```bash
cd storemanagement.client
ng serve
```

### 3. Test Login
1. Navigate to `http://localhost:4200/login`
2. Use credentials: `admin` / `admin123`
3. Check browser dev tools Network tab for API calls
4. Verify JWT token in Application > Storage

### 4. Test Auto-Refresh
1. Login successfully
2. Manually expire the token (change expiry time in storage)
3. Make an API call - should auto-refresh
4. Check Network tab for refresh token call

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend origin
   - Check that API is running on correct port

2. **Login Fails**
   - Verify backend is running and seeded with default users
   - Check database connection in backend
   - Verify environment URLs match backend ports

3. **Token Refresh Fails**
   - Check refresh token is stored correctly
   - Verify backend refresh endpoint is working
   - Clear browser storage and re-login

4. **Interceptor Not Working**
   - Verify HTTP_INTERCEPTORS is configured in app.module.ts
   - Check import path for AuthInterceptor
   - Ensure interceptor is not skipping required endpoints

### Debug Mode
```typescript
// Enable detailed logging in auth.service.ts
console.log('API Call:', url, payload);
console.log('Response:', response);
```

## Production Considerations

1. **Environment Variables**: Update production URLs
2. **Token Security**: Consider additional security headers
3. **Error Handling**: Implement user-friendly error messages
4. **Logging**: Add proper application logging
5. **Monitoring**: Monitor authentication failure rates
6. **Rate Limiting**: Implement client-side rate limiting

## Integration Status

✅ **Environment Configuration**: API URLs configured properly  
✅ **AuthService Integration**: Real API calls implemented  
✅ **HTTP Interceptor**: Auto token management active  
✅ **Login Component**: Using real authentication  
✅ **Token Management**: JWT and refresh token handling  
✅ **Error Handling**: Comprehensive error responses  
✅ **Security**: Secure token storage and transmission  
✅ **Testing**: Default users available for testing  

The Angular frontend is now fully integrated with the .NET Core authentication system! 🎉
