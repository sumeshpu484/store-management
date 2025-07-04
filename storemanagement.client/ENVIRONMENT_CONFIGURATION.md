# Environment Configuration Guide

## Overview
This document explains how the API URLs are now configured using Angular environment files for better configuration management and deployment flexibility.

## Environment Files

### Development Environment (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7071/superadmin',
  authApiUrl: 'https://localhost:5001/api/auth'
};
```

### Production Environment (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-production-api-url/superadmin',
  authApiUrl: 'https://your-production-api-url/api/auth'
};
```

## Services Using Environment Variables

### 1. StoreApiService
- **Location**: `src/app/services/store-api.service.ts`
- **Environment Variable**: `environment.apiBaseUrl`
- **Purpose**: All store management API calls (CRUD operations, user management)

### 2. StoreService (Legacy)
- **Location**: `src/app/services/store.service.ts`
- **Environment Variable**: `environment.apiBaseUrl`
- **Purpose**: Backup/fallback store service with mock data

### 3. AuthService
- **Location**: `src/app/services/auth.service.ts`
- **Environment Variable**: `environment.authApiUrl`
- **Purpose**: Authentication and user management

## Build Configuration

The `angular.json` file has been configured with file replacements for production builds:

```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}
```

## How to Use

### Development
1. Update the development environment file if your local API URL changes:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiBaseUrl: 'https://localhost:YOUR_PORT/superadmin',
     authApiUrl: 'https://localhost:YOUR_AUTH_PORT/api/auth'
   };
   ```

2. Run the development server:
   ```bash
   ng serve
   ```

### Production Deployment
1. Update the production environment file with your production API URLs:
   ```typescript
   // src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiBaseUrl: 'https://api.yourcompany.com/superadmin',
     authApiUrl: 'https://auth.yourcompany.com/api/auth'
   };
   ```

2. Build for production:
   ```bash
   ng build --configuration=production
   ```

## Benefits

1. **Centralized Configuration**: All API URLs are defined in one place per environment
2. **Environment-Specific URLs**: Different URLs for development, staging, and production
3. **Easy Deployment**: No code changes needed when deploying to different environments
4. **Type Safety**: TypeScript ensures proper usage of environment variables
5. **Build-Time Replacement**: Angular automatically uses the correct environment file

## Current API Endpoints

### Store Management API (SuperAdminController)
- Base URL: `environment.apiBaseUrl`
- Endpoints:
  - `GET /storelist` - Get all stores
  - `GET /store/{id}` - Get store by ID
  - `POST /createStore` - Create new store
  - `POST /blockStore` - Toggle store status
  - `GET /getStoreUsers/{storeId}` - Get store users
  - `POST /createUser` - Create store user
  - `POST /blockUser` - Block user
  - `POST /passwordReset` - Reset user password

### Authentication API
- Base URL: `environment.authApiUrl`
- Endpoints: (Currently using mock data with bypass for development)

## Notes

- The authentication service currently has `bypassAuthForDevelopment = true` for easier development
- The store API service is fully integrated with the .NET Core SuperAdminController
- All services include proper error handling and TypeScript type definitions
- The environment files support additional configuration properties as needed

## Troubleshooting

If you encounter API connection issues:

1. Verify the API URLs in the environment file match your running services
2. Check that CORS is properly configured in your .NET Core API
3. Ensure your .NET Core API is running on the specified port
4. Check browser network tab for specific error messages
