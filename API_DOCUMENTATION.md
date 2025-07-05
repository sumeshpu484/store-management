# Store Management API Documentation

## Authentication & Default Credentials

### API Overview
The Store Management API provides endpoints for managing stores, users, and authentication. All user passwords are securely hashed using BCrypt with cost factor 11.

### Default Test Credentials (Development Only)

#### Pre-existing Users
| Username | Password | Role | Store Association |
|----------|----------|------|-------------------|
| `john_doe` | `password123` | Super Admin | None |
| `jane_smith` | `password123` | Store Maker | Main Street Store |
| `mike_jones` | `password123` | Store Checker | Downtown Plaza |
| `sarah_brown` | `password123` | Warehouse Maker | None |
| `david_green` | `password123` | Warehouse Checker | None |

#### Auto-Generated Store Users
When creating a new store via the API, two users are automatically created:

| Username Pattern | Password | Role | Example |
|------------------|----------|------|---------|
| `maker_[StoreKey]` | `password123` | Store Maker | `maker_STR001` |
| `checker_[StoreKey]` | `password123` | Store Checker | `checker_STR001` |

### Security Notes

⚠️ **Important**: All default passwords should be changed immediately in production environments!

- All passwords are securely hashed using BCrypt with cost factor 11
- Each password hash is unique even for the same password (includes salt)
- JWT tokens are used for API authentication
- Tokens include user roles and permissions

### API Endpoints

#### Authentication Endpoints
- `POST /api/auth/login` - User login with username/password
- `POST /api/auth/logout` - User logout (requires authentication)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/change-password` - Change user password
- `POST /api/auth/reset-password` - Reset user password (admin only)

#### Store Management Endpoints
- `POST /superadmin/createStore` - Create new store (auto-creates default users)
- `GET /superadmin/storelist` - List all stores
- `GET /superadmin/store/{storeId}` - Get store details
- `PUT /superadmin/updateStore/{storeId}` - Update store information
- `POST /superadmin/createUser` - Create new store user
- `GET /superadmin/userlist` - List all users
- `GET /superadmin/getStoreUsers/{storeId}` - Get users for specific store

### Password Security Implementation

The application uses PostgreSQL's `pgcrypto` extension for password hashing:

```sql
-- Example of secure password hashing
password_hash = crypt('password123', gen_salt('bf', 11))
```

This ensures:
- BCrypt algorithm with cost factor 11
- Unique salt for each password
- Compatibility with .NET BCrypt.Net library
- Secure password verification

### Quick Start Guide

1. **Login with Default Credentials**:
   ```bash
   curl -X POST "https://localhost:5001/api/auth/login" \
   -H "Content-Type: application/json" \
   -d '{"username":"john_doe","password":"password123"}'
   ```

2. **Create a New Store** (returns auto-generated users):
   ```bash
   curl -X POST "https://localhost:5001/superadmin/createStore" \
   -H "Authorization: Bearer [your-jwt-token]" \
   -H "Content-Type: application/json" \
   -d '{
     "storeName": "Test Store",
     "storeKey": "TST001",
     "address": "123 Test St",
     "city": "Test City",
     "state": "TS",
     "zipCode": "12345",
     "phone": "555-0123"
   }'
   ```

3. **Login with Auto-Generated User**:
   ```bash
   curl -X POST "https://localhost:5001/api/auth/login" \
   -H "Content-Type: application/json" \
   -d '{"username":"maker_TST001","password":"password123"}'
   ```

### Swagger Documentation
Visit the Swagger UI at the application root (`/`) for interactive API documentation with all endpoint details, request/response schemas, and authentication examples.

### Production Deployment Checklist

- [ ] Change all default passwords
- [ ] Update JWT secret key
- [ ] Configure secure database credentials
- [ ] Enable HTTPS
- [ ] Review and update CORS settings
- [ ] Set up proper logging and monitoring
