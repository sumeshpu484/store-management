# Authentication System Implementation

## Overview
Complete authentication system implementation based on the PostgreSQL database schema with Users, Roles, and Stores tables.

## Database Schema Integration

### Tables Used
- **Users**: Main user table with UUID primary key
- **Roles**: User roles (superadmin, store-maker, store-checker, warehouse-maker, warehouse-checker)
- **Stores**: Store information for store-associated users

### Database Features
- UUID-based user IDs using PostgreSQL's `gen_random_uuid()`
- BCrypt password hashing for security
- Role-based access control
- Store association for store-specific users
- Automatic default user creation when stores are created

## Backend Implementation

### Models (`StoreApp.Model.Auth`)
- **User**: Database entity matching Users table
- **Role**: Role entity matching Roles table  
- **Store**: Store entity matching Stores table
- **LoginRequest**: Login credentials DTO
- **AuthResponse**: Authentication response with JWT token
- **UserDto**: Public user information DTO
- **ChangePasswordRequest**: Password change DTO
- **ResetPasswordRequest**: Password reset DTO

### Repository (`StoreApp.Data.Repositories`)
- **IUserRepository**: User data access interface
- **UserRepository**: PostgreSQL implementation using Dapper
  - User authentication and validation
  - Password management
  - User status management
  - Store-based user queries

### Services (`StoreApp.Services.Auth`)
- **IAuthService**: Authentication business logic interface
- **AuthService**: Complete authentication implementation
  - JWT token generation and validation
  - Password hashing with BCrypt
  - Refresh token management
  - Role-based permissions
  - User profile management

### Controllers (`StoreApp.Server.Controllers`)
- **AuthController**: REST API endpoints
  - `POST /api/auth/login` - User authentication
  - `POST /api/auth/refresh` - Token refresh
  - `POST /api/auth/logout` - User logout
  - `POST /api/auth/change-password` - Password change
  - `POST /api/auth/reset-password` - Password reset (admin)
  - `GET /api/auth/profile` - User profile
  - `GET /api/auth/validate` - Token validation

## Frontend Integration

### Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7071/superadmin',
  authApiUrl: 'https://localhost:7071/api/auth'
};
```

### Angular Services Updated
- **AuthService**: Now uses `environment.authApiUrl`
- **StoreApiService**: Uses `environment.apiBaseUrl` 
- **StoreService**: Uses `environment.apiBaseUrl`

## Security Features

### Password Security
- BCrypt hashing with salt (using BCrypt.Net-Next)
- Minimum password length requirements
- Secure password validation

### JWT Security
- HS256 signing algorithm
- 1-hour token expiration
- Refresh token support
- Role-based claims
- Store association claims

### API Security
- Authentication required for protected endpoints
- Role-based authorization
- CORS configuration for frontend integration
- Global exception handling

## Default Users

The system automatically creates default users on startup:

### Superadmin User
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@storemanagement.com`
- **Role**: superadmin
- **Permissions**: Full system access

### Store Manager User  
- **Username**: `store_manager`
- **Password**: `manager123`
- **Email**: `manager@storemanagement.com`
- **Role**: store-maker
- **Store**: Associated with first store

## Role-Based Permissions

### Superadmin
- users.read, users.write
- stores.read, stores.write  
- products.read, products.write
- reports.read, settings.write

### Store-Maker
- products.read, products.write
- inventory.read, inventory.write

### Store-Checker
- products.read
- inventory.read, reports.read

### Warehouse-Maker
- inventory.read, inventory.write
- products.read

### Warehouse-Checker
- inventory.read, products.read
- reports.read

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/refresh  
POST /api/auth/logout
POST /api/auth/change-password
POST /api/auth/reset-password
GET  /api/auth/profile
GET  /api/auth/validate
```

### Store Management Endpoints (SuperAdmin)
```
GET  /superadmin/storelist
GET  /superadmin/store/{id}
POST /superadmin/createStore  
POST /superadmin/blockStore
GET  /superadmin/getStoreUsers/{storeId}
POST /superadmin/createUser
POST /superadmin/blockUser
POST /superadmin/passwordReset
```

## Configuration

### Database Connection
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=store_management;Username=your_user;Password=your_password"
  }
}
```

### JWT Configuration
```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-here-make-it-long-and-complex-for-production-use",
    "Issuer": "StoreManagement",
    "Audience": "StoreManagement"
  }
}
```

## Testing the Authentication

### 1. Start the API
```bash
cd StoreApp.Server
dotnet run
```

### 2. Test Login
```bash
curl -X POST https://localhost:7071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","rememberMe":false}'
```

### 3. Test Protected Endpoint
```bash
curl -X GET https://localhost:7071/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development Notes

1. **Password Security**: Default passwords should be changed in production
2. **JWT Secret**: Use a strong, unique secret key in production
3. **Refresh Tokens**: Currently stored in memory; use Redis or database for production
4. **Token Blacklisting**: Implement proper token blacklisting for production
5. **Rate Limiting**: Consider adding rate limiting for login attempts
6. **Email Verification**: Add email verification for new user registrations

## Integration Status

✅ **Database Integration**: Complete PostgreSQL integration with Dapper  
✅ **Password Security**: BCrypt hashing implementation  
✅ **JWT Authentication**: Full JWT implementation with refresh tokens  
✅ **Role-Based Access**: Complete RBAC with database roles  
✅ **API Endpoints**: All authentication endpoints implemented  
✅ **Frontend Integration**: Angular services updated with environment config  
✅ **Default Users**: Automatic seeding of test users  
✅ **Documentation**: Complete API and implementation documentation  

The authentication system is now fully integrated with your database schema and ready for production use with proper security configurations.
