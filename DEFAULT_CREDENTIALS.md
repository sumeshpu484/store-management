# Default Login Credentials

## For Testing and Development Only

After running the database script and starting the API, you can use these credentials:

### Database Script Users (from SQL)
- **Username:** `john_doe` | **Password:** `password123` | **Role:** superadmin
- **Username:** `jane_smith` | **Password:** `password123` | **Role:** store-maker  
- **Username:** `mike_jones` | **Password:** `password123` | **Role:** store-checker
- **Username:** `sarah_brown` | **Password:** `password123` | **Role:** warehouse-maker
- **Username:** `david_green` | **Password:** `password123` | **Role:** warehouse-checker

### DataSeedingService Users (from C# code)
- **Username:** `admin` | **Password:** `admin123` | **Role:** superadmin
- **Username:** `store_manager` | **Password:** `manager123` | **Role:** store-maker

## Login Process
1. Start the .NET API server
2. Navigate to Angular login page
3. Use any of the above credentials
4. The system will authenticate via JWT tokens

## Production Warning
⚠️ **IMPORTANT:** Change all default passwords before deploying to production!

## Troubleshooting BCrypt Errors
If you get "Invalid salt version" errors:
1. **Re-run the updated database script** with proper BCrypt hashes (updated Jan 2025)
2. Check that the DataSeedingService is running (check server logs)
3. Verify the password you're entering matches the credentials above
4. **Make sure your database is connected** - check connection string in appsettings.json
5. **Check server logs** for authentication errors

## Recent Updates
- **Fixed BCrypt hashes** - All passwords now use proper BCrypt format
- **All database users** now use the same password: `password123`
- **DataSeedingService users** use different passwords as specified above
