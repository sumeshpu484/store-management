# API Base URL Configuration Update

## 🎯 API URL Updated for Separate Development

The API base URL has been updated to connect to your .NET Core API running on `https://localhost:7071/`.

## ✅ Changes Made

### **1. StoreApiService (Primary Service)**
```typescript
// Updated in: store-api.service.ts
private readonly apiUrl = 'https://localhost:7071/superadmin';
```

### **2. StoreService (Legacy Service)**
```typescript
// Updated in: store.service.ts  
private readonly apiUrl = 'https://localhost:7071/superadmin';
```

## 🚀 Development Setup

### **Current Configuration:**
- **Angular App**: `https://localhost:4200` (when running `npm start`)
- **API Server**: `https://localhost:7071`
- **API Endpoints**: `https://localhost:7071/superadmin/*`

### **Available API Endpoints:**
- `GET https://localhost:7071/superadmin/storelist` - List all stores
- `POST https://localhost:7071/superadmin/createStore` - Create new store
- `GET https://localhost:7071/superadmin/getStoreUsers/{storeId}` - Get store users
- `POST https://localhost:7071/superadmin/blockUser` - Block/unblock user
- `POST https://localhost:7071/superadmin/blockStore` - Block/unblock store
- `POST https://localhost:7071/superadmin/passwordReset` - Reset user password

## 🔧 CORS Configuration Check

Since you're running on different ports, ensure your .NET Core API has CORS enabled. Your `Program.cs` should have:

```csharp
// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// In the app configuration:
app.UseCors();
```

## 🧪 Testing the Connection

### **Method 1: Test API Directly**
1. Open browser: `https://localhost:7071/swagger`
2. Test endpoints directly in Swagger UI

### **Method 2: Test from Angular**
1. Run Angular: `npm start` (in storemanagement.client folder)
2. Navigate to Store Management
3. Check browser console for any CORS or network errors

### **Method 3: Check Network Tab**
1. Open browser Developer Tools
2. Go to Network tab
3. Try creating a store or loading stores
4. Verify requests go to `https://localhost:7071/superadmin/*`

## 🐛 Troubleshooting

### **If you see CORS errors:**
```
Access to XMLHttpRequest at 'https://localhost:7071/superadmin/storelist' 
from origin 'https://localhost:4200' has been blocked by CORS policy
```

**Solution**: Ensure CORS is enabled in your .NET Core API `Program.cs`

### **If you see "ERR_CONNECTION_REFUSED":**
- Verify your API is running on `https://localhost:7071`
- Check if the port is correct
- Ensure API project is started

### **If you see SSL/Certificate errors:**
- Try using `http://localhost:7071` instead (if not using HTTPS)
- Or accept the certificate in browser by visiting `https://localhost:7071` directly

## 🔄 Alternative Configurations

### **Option 1: Use HTTP instead of HTTPS**
If you have SSL issues, update to:
```typescript
private readonly apiUrl = 'http://localhost:7071/superadmin';
```

### **Option 2: Different Port**
If your API runs on a different port:
```typescript
private readonly apiUrl = 'https://localhost:YOUR_PORT/superadmin';
```

### **Option 3: Production URL**
For production deployment:
```typescript
private readonly apiUrl = 'https://your-production-api.com/superadmin';
```

## 📋 Quick Test Checklist

- [ ] API is running on `https://localhost:7071`
- [ ] Swagger UI accessible at `https://localhost:7071/swagger`
- [ ] CORS is enabled in API
- [ ] Angular app can make requests without CORS errors
- [ ] Store Management loads data from real API
- [ ] User Management functions work with real API

## 🎊 Result

**API Base URL**: ✅ **UPDATED TO `https://localhost:7071/superadmin`**

Your Angular application will now connect to your .NET Core API running on port 7071. All store and user management operations will use the real database through your SuperAdminController.

**Next Step**: Start your Angular app with `npm start` and test the Store Management features!
