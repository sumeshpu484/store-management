# Password Hash Fix - Login Issue Resolution

## Problem Identified
The login failure for newly created users was caused by an incorrect BCrypt hash being used in the database scripts. The hardcoded hash `$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO` does **NOT** correspond to the password "password123".

## Root Cause
- Database scripts were using a hardcoded, incorrect BCrypt hash
- New users created via the `create_store_with_users` function received this wrong hash
- Authentication failed because BCrypt.Verify("password123", wrong_hash) returned false

## Solution Implemented
Updated all database scripts to use PostgreSQL's `pgcrypto` extension to generate proper BCrypt hashes:

### Files Updated:
1. **database-script.sql** - Initial database setup
2. **update-create-store-function.sql** - Store creation function
3. **fix-user-passwords.sql** - Manual password fix script (new)

### Changes Made:
- Added `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` to enable password hashing
- Replaced hardcoded hash with `crypt('password123', gen_salt('bf', 11))`
- This generates proper BCrypt hashes with cost factor 11 (same as .NET BCrypt)

### Before (Wrong):
```sql
password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'
```

### After (Correct):
```sql
password_hash = crypt('password123', gen_salt('bf', 11))
```

## How to Apply the Fix

### For New Installations:
1. Run the updated `database-script.sql` - it will create users with correct hashes
2. Run `update-store-table.sql` to add new columns
3. Run `update-create-store-function.sql` to update the store creation function

### For Existing Installations:
1. Run `update-store-table.sql` to add new columns (if not already done)
2. Run `update-create-store-function.sql` to fix the store creation function
3. **Optional**: Run `fix-user-passwords.sql` to fix existing users' passwords (uncomment the users you want to fix)

## Verification
After applying the fix:
1. New stores created via the API will have users with correct password hashes
2. Users can login with username and password "password123"
3. Authentication flow will work properly with BCrypt.Verify()

## Default Credentials (Testing Only)
- **Username**: Any newly created user (e.g., `maker_STR001`, `checker_STR001`)
- **Password**: `password123`

**Important**: Change default passwords in production!

## Technical Details
- Uses PostgreSQL's `pgcrypto` extension
- BCrypt cost factor: 11 (matches .NET implementation)
- Hash format: `$2a$11$...` (compatible with BCrypt.Net)
- Each password generates a unique hash (salt included)
